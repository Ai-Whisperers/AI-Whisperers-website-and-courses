// Real-time File System Watcher for Architecture Updates
// Monitors file changes and triggers architecture refresh automatically

import fs from 'fs'
import path from 'path'
import { EventEmitter } from 'events'

interface WatchEvent {
  type: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir'
  path: string
  timestamp: Date
}

interface WatchOptions {
  ignored?: string[]
  debounceMs?: number
  recursive?: boolean
}

export class FileWatcher extends EventEmitter {
  private watchers: fs.FSWatcher[] = []
  private watchedPaths: Set<string> = new Set()
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map()
  private isWatching = false

  constructor(
    private rootPath: string,
    private options: WatchOptions = {}
  ) {
    super()
    
    // Default options
    this.options = {
      ignored: ['node_modules', '.next', '.git', 'local-reports', ...this.options.ignored || []],
      debounceMs: 500, // Wait 500ms before triggering update
      recursive: true,
      ...this.options
    }
  }

  // Start watching the file system
  public startWatching(): void {
    if (this.isWatching) {
      console.log('📁 File watcher already running')
      return
    }

    console.log('🔍 Starting file system watcher for architecture updates...')
    
    try {
      this.setupWatcher(this.rootPath)
      this.isWatching = true
      console.log('✅ File watcher started successfully')
      
      // Emit initial watch started event
      this.emit('watchStarted', {
        rootPath: this.rootPath,
        timestamp: new Date()
      })
      
    } catch (error) {
      console.error('❌ Failed to start file watcher:', error)
      this.emit('error', error)
    }
  }

  // Stop watching the file system
  public stopWatching(): void {
    if (!this.isWatching) {
      console.log('📁 File watcher not running')
      return
    }

    console.log('🛑 Stopping file system watcher...')
    
    // Clear all debounce timers
    this.debounceTimers.forEach(timer => clearTimeout(timer))
    this.debounceTimers.clear()
    
    // Close all watchers
    this.watchers.forEach(watcher => {
      try {
        watcher.close()
      } catch (error) {
        console.warn('Warning: Error closing watcher:', error)
      }
    })
    
    this.watchers = []
    this.watchedPaths.clear()
    this.isWatching = false
    
    console.log('✅ File watcher stopped')
    
    this.emit('watchStopped', {
      timestamp: new Date()
    })
  }

  // Setup file watcher for a directory
  private setupWatcher(dirPath: string): void {
    if (this.watchedPaths.has(dirPath) || this.isIgnored(dirPath)) {
      return
    }

    try {
      const watcher = fs.watch(dirPath, { recursive: false }, (eventType, filename) => {
        if (!filename) return

        const fullPath = path.join(dirPath, filename)
        
        // Skip ignored files/directories
        if (this.isIgnored(fullPath) || this.isIgnored(filename)) {
          return
        }

        this.handleFileEvent(eventType, fullPath)
      })

      this.watchers.push(watcher)
      this.watchedPaths.add(dirPath)

      // If recursive, watch subdirectories
      if (this.options.recursive) {
        try {
          const items = fs.readdirSync(dirPath, { withFileTypes: true })
          
          for (const item of items) {
            if (item.isDirectory()) {
              const subPath = path.join(dirPath, item.name)
              if (!this.isIgnored(subPath)) {
                this.setupWatcher(subPath)
              }
            }
          }
        } catch (error) {
          // Ignore permission errors or other issues reading directories
        }
      }

    } catch (error) {
      console.warn(`Warning: Could not watch directory ${dirPath}:`, error)
    }
  }

  // Handle file system events with debouncing
  private handleFileEvent(eventType: string, filePath: string): void {
    // Clear existing debounce timer for this file
    const existingTimer = this.debounceTimers.get(filePath)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // Set new debounce timer
    const timer = setTimeout(() => {
      this.processFileEvent(eventType, filePath)
      this.debounceTimers.delete(filePath)
    }, this.options.debounceMs)

    this.debounceTimers.set(filePath, timer)
  }

  // Process the actual file event
  private processFileEvent(eventType: string, filePath: string): void {
    let watchEventType: WatchEvent['type'] = 'change'

    try {
      const stats = fs.statSync(filePath)
      
      if (stats.isDirectory()) {
        watchEventType = eventType === 'rename' ? 'addDir' : 'change'
        
        // If new directory, start watching it too
        if (watchEventType === 'addDir' && this.options.recursive) {
          this.setupWatcher(filePath)
        }
      } else {
        watchEventType = eventType === 'rename' ? 'add' : 'change'
      }
      
    } catch (error) {
      // File doesn't exist, it was deleted
      watchEventType = filePath.includes('.') ? 'unlink' : 'unlinkDir'
    }

    const event: WatchEvent = {
      type: watchEventType,
      path: filePath,
      timestamp: new Date()
    }

    console.log(`📁 File ${watchEventType}: ${path.relative(this.rootPath, filePath)}`)

    // Emit the file change event
    this.emit('fileChange', event)

    // Check if this is an architecture-relevant file
    if (this.isArchitectureRelevant(filePath)) {
      console.log('🏗️ Architecture-relevant file changed, triggering update...')
      this.emit('architectureUpdate', event)
    }
  }

  // Check if a file/directory should be ignored
  private isIgnored(filePath: string): boolean {
    const relativePath = path.relative(this.rootPath, filePath)
    const basename = path.basename(filePath)
    
    return this.options.ignored!.some(ignored => {
      // Check if the path starts with ignored pattern
      return relativePath.startsWith(ignored) || 
             basename.startsWith('.') ||
             basename.includes('node_modules') ||
             basename.includes('.git')
    })
  }

  // Check if a file change is relevant for architecture updates
  private isArchitectureRelevant(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase()
    const relativePath = path.relative(this.rootPath, filePath)
    
    // Architecture-relevant file types
    const relevantExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.yml', '.yaml']
    const isRelevantExtension = relevantExtensions.includes(ext)
    
    // Architecture-relevant directories
    const relevantDirs = ['src/', 'docs/', 'scripts/', 'public/']
    const isRelevantDir = relevantDirs.some(dir => relativePath.startsWith(dir))
    
    // Configuration files
    const configFiles = [
      'package.json', 'tsconfig.json', 'next.config.ts', 'tailwind.config.js',
      'eslint.config.mjs', 'postcss.config.mjs', '.prettierrc.json',
      '.pre-commit-config.yaml', 'CLAUDE.md', 'README.md'
    ]
    const isConfigFile = configFiles.includes(path.basename(filePath))
    
    return isRelevantExtension && (isRelevantDir || isConfigFile)
  }

  // Get watcher status
  public getStatus(): {
    isWatching: boolean
    watchedPaths: number
    rootPath: string
    options: WatchOptions
  } {
    return {
      isWatching: this.isWatching,
      watchedPaths: this.watchedPaths.size,
      rootPath: this.rootPath,
      options: this.options
    }
  }

  // Manually trigger architecture update
  public triggerArchitectureUpdate(): void {
    console.log('🔄 Manually triggering architecture update...')
    
    const event: WatchEvent = {
      type: 'change',
      path: this.rootPath,
      timestamp: new Date()
    }
    
    this.emit('architectureUpdate', event)
  }
}

// Singleton instance for use across the application
let globalWatcher: FileWatcher | null = null

export function getFileWatcher(rootPath?: string): FileWatcher {
  if (!globalWatcher) {
    globalWatcher = new FileWatcher(rootPath || process.cwd())
  }
  return globalWatcher
}

export function startGlobalWatcher(rootPath?: string): FileWatcher {
  const watcher = getFileWatcher(rootPath)
  watcher.startWatching()
  return watcher
}

export function stopGlobalWatcher(): void {
  if (globalWatcher) {
    globalWatcher.stopWatching()
    globalWatcher = null
  }
}