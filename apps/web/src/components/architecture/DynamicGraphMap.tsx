'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DynamicIcon } from '@/components/content/DynamicIcon'
import { GraphLevel, GraphVertex } from './RealArchitectureData'

interface DynamicGraphMapProps {
  className?: string
}

interface ArchitectureData {
  levels: GraphLevel[]
  stats: any
  criticalComponents: any[]
  healthSummary: any
  metadata: {
    analysisTime: string
    totalFiles: number
    lastUpdated: string
    cacheHit: boolean
    realTime: boolean
  }
}

export function DynamicGraphMap({ className }: DynamicGraphMapProps) {
  const [selectedLevel, setSelectedLevel] = useState<-1 | 0 | 1 | 2>(0)
  const [selectedVertex, setSelectedVertex] = useState<GraphVertex | null>(null)
  const [showCriticalPath, setShowCriticalPath] = useState(false)
  const [architectureData, setArchitectureData] = useState<ArchitectureData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Load real-time architecture data
  useEffect(() => {
    loadArchitectureData()
  }, [])

  const loadArchitectureData = async (forceRefresh = false) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const url = forceRefresh ? '/api/architecture?refresh=true' : '/api/architecture'
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to load architecture data: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setArchitectureData(result.data)
        setLastRefresh(new Date())
        console.log('✅ Real-time architecture data loaded:', result.data.metadata)
      } else {
        throw new Error(result.error || 'Failed to load architecture data')
      }
    } catch (err) {
      console.error('Architecture data loading error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing real codebase structure...</p>
          <p className="text-sm text-gray-500 mt-2">Scanning files and dependencies</p>
        </div>
      </div>
    )
  }

  if (error || !architectureData) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
        <div className="p-8 text-center">
          <DynamicIcon name="AlertCircle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Architecture Analysis Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadArchitectureData(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    )
  }

  const currentLevel = architectureData.levels.find(level => level.level === selectedLevel)

  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
      {/* Header with Real-time Status */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              EC4RO-HGN Architecture Map
            </h2>
            <p className="text-gray-600 mb-3">
              Real-time codebase analysis using Extended C4 methodology
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <DynamicIcon name="Files" className="h-4 w-4" />
                <span>{architectureData.stats.totalFiles} files</span>
              </div>
              <div className="flex items-center space-x-1">
                <DynamicIcon name="GitBranch" className="h-4 w-4" />
                <span>{architectureData.stats.totalDependencies} dependencies</span>
              </div>
              <div className="flex items-center space-x-1">
                <DynamicIcon name="Award" className="h-4 w-4" />
                <span>Grade {architectureData.stats.architectureGrade}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DynamicIcon name={architectureData.metadata.cacheHit ? "Database" : "Zap"} className="h-4 w-4" />
                <span>{architectureData.metadata.cacheHit ? 'Cached' : 'Live'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCriticalPath(!showCriticalPath)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                showCriticalPath 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              <DynamicIcon name="Zap" className="h-4 w-4" />
              <span>Critical Path</span>
            </button>
            <button
              onClick={() => loadArchitectureData(true)}
              className="flex items-center space-x-2 px-3 py-1 rounded-lg text-sm bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition-colors"
            >
              <DynamicIcon name="RefreshCw" className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <div className="flex items-center space-x-2">
              <DynamicIcon name="GitGraph" className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Real-Time Data</span>
            </div>
          </div>
        </div>
        
        {/* Real-time Status Info */}
        <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <strong>Last Analysis:</strong> {new Date(architectureData.metadata.lastUpdated).toLocaleTimeString()}
            </div>
            <div>
              <strong>Analysis Time:</strong> {architectureData.metadata.analysisTime}
            </div>
            <div>
              <strong>Health Score:</strong> {architectureData.healthSummary.score}/100
            </div>
            <div>
              <strong>Critical Components:</strong> {architectureData.criticalComponents.length}
            </div>
          </div>
        </div>
      </div>

      {/* Level Navigation */}
      <div className="p-6 border-b bg-gray-50">
        <div className="grid grid-cols-4 gap-4">
          {architectureData.levels.map((level) => (
            <motion.button
              key={level.level}
              onClick={() => {
                setSelectedLevel(level.level)
                setSelectedVertex(null)
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedLevel === level.level
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`text-sm font-bold mb-1 bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                Level {level.level === -1 ? '-1' : level.level}
              </div>
              <div className="text-xs font-semibold text-gray-800 mb-1">
                {level.title}
              </div>
              <div className="text-xs text-gray-600">
                {level.vertices.length} components
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {level.stats.totalFiles} files
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Graph Visualization */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {currentLevel && (
            <motion.div
              key={selectedLevel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Level Header */}
              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r ${currentLevel.color} bg-clip-text text-transparent`}>
                  Level {currentLevel.level === -1 ? '-1' : currentLevel.level}: {currentLevel.title}
                </h3>
                <p className="text-gray-600 mb-3">{currentLevel.description}</p>
                <div className="flex space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <DynamicIcon name="Files" className="h-4 w-4" />
                    <span>{currentLevel.stats.totalFiles} files</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DynamicIcon name="GitBranch" className="h-4 w-4" />
                    <span>{currentLevel.stats.totalDependencies} dependencies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DynamicIcon name="Award" className="h-4 w-4" />
                    <span>{currentLevel.stats.qualityScore}% quality</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DynamicIcon name="Clock" className="h-4 w-4" />
                    <span>Live data</span>
                  </div>
                </div>
              </div>

              {/* Graph Canvas */}
              <div className="relative bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200 rounded-lg p-8 min-h-96">
                <svg width="100%" height="400" className="absolute inset-0">
                  {/* Connection Lines */}
                  {currentLevel.vertices.map((vertex) =>
                    vertex.dependencies.map((depId) => {
                      const dependency = currentLevel.vertices.find(v => v.id === depId) ||
                                       architectureData.levels.flatMap(l => l.vertices).find(v => v.id === depId)
                      if (!dependency) return null
                      
                      const isCriticalPath = showCriticalPath && 
                        ((vertex.metrics?.importance === 'Critical' || vertex.status === 'Critical') ||
                         (dependency.metrics?.importance === 'Critical' || dependency.status === 'Critical'))
                      
                      return (
                        <line
                          key={`${vertex.id}-${depId}`}
                          x1={`${dependency.position.x}%`}
                          y1={`${dependency.position.y}%`}
                          x2={`${vertex.position.x}%`}
                          y2={`${vertex.position.y}%`}
                          stroke={isCriticalPath ? "#ef4444" : "#e5e7eb"}
                          strokeWidth={isCriticalPath ? "3" : "2"}
                          strokeDasharray={isCriticalPath ? "8,4" : "5,5"}
                          opacity={isCriticalPath ? "0.8" : "0.6"}
                        />
                      )
                    })
                  )}
                </svg>

                {/* Vertices */}
                {currentLevel.vertices.map((vertex) => (
                  <motion.div
                    key={vertex.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                      selectedVertex?.id === vertex.id ? 'z-20' : 'z-10'
                    }`}
                    style={{
                      left: `${vertex.position.x}%`,
                      top: `${vertex.position.y}%`
                    }}
                    onClick={() => setSelectedVertex(vertex)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`p-4 bg-white rounded-lg shadow-lg border-2 transition-all ${
                      selectedVertex?.id === vertex.id
                        ? 'border-blue-500 shadow-xl'
                        : showCriticalPath && (vertex.metrics?.importance === 'Critical' || vertex.status === 'Critical')
                        ? 'border-red-400 hover:border-red-500 hover:shadow-xl bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${currentLevel.color} relative`}>
                          <DynamicIcon name={vertex.icon} className="h-4 w-4 text-white" />
                          {vertex.health === 'Monitor' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"></div>
                          )}
                          {vertex.health === 'Refactor' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-sm text-gray-900">
                            {vertex.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {vertex.category}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex space-x-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          vertex.complexity === 'High' ? 'bg-red-100 text-red-800' :
                          vertex.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {vertex.complexity}
                        </span>
                        {vertex.health && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            vertex.health === 'Excellent' ? 'bg-green-100 text-green-800' :
                            vertex.health === 'Good' ? 'bg-blue-100 text-blue-800' :
                            vertex.health === 'Monitor' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {vertex.health}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vertex Detail Panel */}
      <AnimatePresence>
        {selectedVertex && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-gradient-to-br from-blue-50 to-indigo-50"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${currentLevel?.color} relative`}>
                    <DynamicIcon name={selectedVertex.icon} className="h-6 w-6 text-white" />
                    {selectedVertex.health === 'Monitor' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{selectedVertex.name}</h4>
                    <p className="text-gray-600 mt-1">{selectedVertex.description}</p>
                    <div className="flex items-center flex-wrap gap-4 mt-3">
                      <span className="text-sm text-gray-500">
                        <strong>Level:</strong> {selectedVertex.level === -1 ? '-1' : selectedVertex.level}
                      </span>
                      <span className="text-sm text-gray-500">
                        <strong>Category:</strong> {selectedVertex.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedVertex.status === 'Critical' ? 'bg-red-100 text-red-800' :
                        selectedVertex.status === 'Active' ? 'bg-green-100 text-green-800' :
                        selectedVertex.status === 'Development' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedVertex.status}
                      </span>
                      {selectedVertex.files && (
                        <span className="text-sm text-gray-500">
                          <strong>Files:</strong> {selectedVertex.files.length}
                        </span>
                      )}
                      {selectedVertex.metrics?.importance && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedVertex.metrics.importance === 'Critical' ? 'bg-red-100 text-red-800' :
                          selectedVertex.metrics.importance === 'High' ? 'bg-orange-100 text-orange-800' :
                          selectedVertex.metrics.importance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedVertex.metrics.importance} Priority
                        </span>
                      )}
                      {selectedVertex.health && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedVertex.health === 'Excellent' ? 'bg-green-100 text-green-800' :
                          selectedVertex.health === 'Good' ? 'bg-blue-100 text-blue-800' :
                          selectedVertex.health === 'Monitor' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedVertex.health} Health
                        </span>
                      )}
                    </div>
                    {selectedVertex.metrics && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Live Coupling Metrics</h5>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-gray-500">Afferent:</span>
                            <div className="font-medium">{selectedVertex.metrics.afferentCoupling}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Efferent:</span>
                            <div className="font-medium">{selectedVertex.metrics.efferentCoupling}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Instability:</span>
                            <div className="font-medium">{selectedVertex.metrics.instability?.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVertex(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <DynamicIcon name="X" className="h-5 w-5" />
                </button>
              </div>
              
              {selectedVertex.files && selectedVertex.files.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">
                    Real Files ({selectedVertex.files.length})
                  </h5>
                  <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    {selectedVertex.files.map((file, index) => (
                      <div key={index} className="text-xs text-gray-600 font-mono mb-1">
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedVertex.dependencies.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Dependencies</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedVertex.dependencies.map((depId) => {
                      const dependency = architectureData.levels
                        .flatMap(l => l.vertices)
                        .find(v => v.id === depId)
                      
                      return dependency ? (
                        <span
                          key={depId}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full border cursor-pointer hover:bg-gray-200"
                          onClick={() => setSelectedVertex(dependency)}
                        >
                          {dependency.name}
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Navigation Breadcrumbs */}
      <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>EC4RO-HGN Live</span>
            <DynamicIcon name="ChevronRight" className="h-4 w-4" />
            <span>Level {selectedLevel === -1 ? '-1' : selectedLevel}</span>
            {selectedVertex && (
              <>
                <DynamicIcon name="ChevronRight" className="h-4 w-4" />
                <span className="font-medium">{selectedVertex.name}</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Last refresh: {lastRefresh?.toLocaleTimeString() || 'Loading...'}
          </div>
        </div>
      </div>
    </div>
  )
}