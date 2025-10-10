/**
 * Render Tunnel Client
 * Runs on local development to connect to production tunnel server
 *
 * ✅ PHASE 3: Render-Local Data Tunnel
 */

import { io, Socket } from 'socket.io-client'
import type {
  TunnelAuthPayload,
  TunnelAuthResponse,
  TunnelClientConfig,
  LogEntry,
  LogStreamOptions,
  WebhookPayload,
  DataSyncRequest,
  DataSyncResponse,
  FeatureFlagSync,
  EnvValidationRequest,
  EnvValidationResponse,
  HealthCheckResponse,
  TunnelConnectionError,
  TunnelAuthError,
} from '@aiwhisperers/render-tunnel/types'
import { EventEmitter } from 'events'

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_CONFIG: TunnelClientConfig = {
  serverUrl: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3001',
  secret: process.env.RENDER_TUNNEL_SECRET || 'dev-secret-change-me',
  reconnect: true,
  reconnectAttempts: 5,
  reconnectDelay: 3000,
  environment: 'development',
}

// ============================================================================
// Tunnel Client Class
// ============================================================================

export class TunnelClient extends EventEmitter {
  private socket: Socket | null = null
  private config: TunnelClientConfig
  private isAuthenticated = false
  private reconnectAttempt = 0

  constructor(config: Partial<TunnelClientConfig> = {}) {
    super()
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  // ==========================================================================
  // Connection
  // ==========================================================================

  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${this.config.serverUrl}/render-tunnel`

      console.log(`[Tunnel Client] Connecting to ${url}...`)

      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        reconnection: this.config.reconnect,
        reconnectionAttempts: this.config.reconnectAttempts,
        reconnectionDelay: this.config.reconnectDelay,
      })

      // Connection events
      this.socket.on('connect', () => {
        console.log('[Tunnel Client] Connected')
        this.authenticate()
          .then(() => resolve())
          .catch(reject)
      })

      this.socket.on('disconnect', (reason) => {
        console.log(`[Tunnel Client] Disconnected: ${reason}`)
        this.isAuthenticated = false
        this.emit('disconnect', reason)
      })

      this.socket.on('connect_error', (error) => {
        console.error('[Tunnel Client] Connection error:', error.message)
        this.emit('error', new TunnelConnectionError(error.message))

        if (this.reconnectAttempt >= this.config.reconnectAttempts) {
          reject(new TunnelConnectionError('Max reconnection attempts reached'))
        }
        this.reconnectAttempt++
      })

      // Setup event handlers
      this.setupEventHandlers()
    })
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isAuthenticated = false
      console.log('[Tunnel Client] Disconnected')
    }
  }

  // ==========================================================================
  // Authentication
  // ==========================================================================

  private async authenticate(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new TunnelConnectionError('Not connected'))
        return
      }

      const payload: TunnelAuthPayload = {
        secret: this.config.secret,
        environment: this.config.environment,
        timestamp: Date.now(),
      }

      this.socket.emit('authenticate', payload)

      this.socket.once('authenticated', (response: TunnelAuthResponse) => {
        if (response.success) {
          this.isAuthenticated = true
          this.reconnectAttempt = 0
          console.log('[Tunnel Client] Authenticated successfully')
          this.emit('authenticated', response)
          resolve()
        } else {
          reject(new TunnelAuthError(response.message))
        }
      })

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isAuthenticated) {
          reject(new TunnelAuthError('Authentication timeout'))
        }
      }, 10000)
    })
  }

  // ==========================================================================
  // Event Handlers
  // ==========================================================================

  private setupEventHandlers(): void {
    if (!this.socket) return

    // Logs
    this.socket.on('log', (entry: LogEntry) => {
      this.emit('log', entry)
    })

    // Webhooks
    this.socket.on('webhook', (payload: WebhookPayload) => {
      this.emit('webhook', payload)
    })

    // Data sync
    this.socket.on('data-sync-response', (response: DataSyncResponse) => {
      this.emit('data-sync-response', response)
    })

    // Feature flags
    this.socket.on('feature-flag-sync', (sync: FeatureFlagSync) => {
      this.emit('feature-flag-sync', sync)
    })

    // Environment validation
    this.socket.on('env-validation-response', (response: EnvValidationResponse) => {
      this.emit('env-validation-response', response)
    })

    // Health check
    this.socket.on('health-check', (health: HealthCheckResponse) => {
      this.emit('health-check', health)
    })

    // Errors
    this.socket.on('error', (error: any) => {
      console.error('[Tunnel Client] Server error:', error)
      this.emit('error', error)
    })
  }

  // ==========================================================================
  // Logging
  // ==========================================================================

  public streamLogs(options: LogStreamOptions = {}): void {
    if (!this.isAuthenticated || !this.socket) {
      throw new TunnelAuthError('Not authenticated')
    }

    console.log('[Tunnel Client] Starting log stream...')

    this.socket.emit('log-stream-start', options)

    this.on('log', (entry: LogEntry) => {
      // Filter by level if specified
      if (options.filter && entry.level !== options.filter) {
        return
      }

      // Filter by service if specified
      if (options.service && entry.service !== options.service) {
        return
      }

      // Format and print
      const timestamp = new Date(entry.timestamp).toISOString()
      const level = entry.level.toUpperCase().padEnd(5)
      console.log(`[${timestamp}] [${level}] [${entry.service}] ${entry.message}`)

      if (entry.context && Object.keys(entry.context).length > 0) {
        console.log('  Context:', JSON.stringify(entry.context, null, 2))
      }
    })
  }

  public stopStreamingLogs(): void {
    if (this.socket) {
      this.socket.emit('log-stream-stop')
      this.removeAllListeners('log')
      console.log('[Tunnel Client] Stopped log stream')
    }
  }

  // ==========================================================================
  // Webhooks
  // ==========================================================================

  public async forwardWebhook(
    provider: string,
    localPort: number,
    localPath: string = '/api/webhooks'
  ): Promise<void> {
    if (!this.isAuthenticated || !this.socket) {
      throw new TunnelAuthError('Not authenticated')
    }

    console.log(`[Tunnel Client] Forwarding ${provider} webhooks to localhost:${localPort}${localPath}`)

    this.on('webhook', async (payload: WebhookPayload) => {
      if (payload.provider !== provider) {
        return
      }

      try {
        const response = await fetch(`http://localhost:${localPort}${localPath}`, {
          method: 'POST',
          headers: payload.headers,
          body: JSON.stringify(payload.data),
        })

        if (response.ok) {
          console.log(`[Tunnel Client] Webhook forwarded: ${payload.event}`)
        } else {
          console.error(`[Tunnel Client] Webhook forward failed: ${response.statusText}`)
        }
      } catch (error) {
        console.error('[Tunnel Client] Webhook forward error:', error)
      }
    })
  }

  // ==========================================================================
  // Data Sync
  // ==========================================================================

  public async syncData(request: DataSyncRequest): Promise<DataSyncResponse> {
    return new Promise((resolve, reject) => {
      if (!this.isAuthenticated || !this.socket) {
        reject(new TunnelAuthError('Not authenticated'))
        return
      }

      console.log(`[Tunnel Client] Syncing data: ${request.table}`)

      this.socket.emit('data-sync-request', request)

      const timeout = setTimeout(() => {
        reject(new Error('Data sync timeout'))
      }, 30000)

      this.once('data-sync-response', (response: DataSyncResponse) => {
        clearTimeout(timeout)
        console.log(`[Tunnel Client] Data synced: ${response.count} rows`)
        resolve(response)
      })
    })
  }

  // ==========================================================================
  // Feature Flags
  // ==========================================================================

  public async syncFeatureFlags(): Promise<FeatureFlagSync> {
    return new Promise((resolve, reject) => {
      if (!this.isAuthenticated || !this.socket) {
        reject(new TunnelAuthError('Not authenticated'))
        return
      }

      console.log('[Tunnel Client] Syncing feature flags...')

      this.socket.emit('feature-flag-sync')

      const timeout = setTimeout(() => {
        reject(new Error('Feature flag sync timeout'))
      }, 10000)

      this.once('feature-flag-sync', (sync: FeatureFlagSync) => {
        clearTimeout(timeout)
        console.log(`[Tunnel Client] Feature flags synced: ${sync.flags.length} flags`)
        resolve(sync)
      })
    })
  }

  // ==========================================================================
  // Environment Validation
  // ==========================================================================

  public async validateEnv(variables: string[]): Promise<EnvValidationResponse> {
    return new Promise((resolve, reject) => {
      if (!this.isAuthenticated || !this.socket) {
        reject(new TunnelAuthError('Not authenticated'))
        return
      }

      console.log(`[Tunnel Client] Validating ${variables.length} environment variables...`)

      const request: EnvValidationRequest = { variables }
      this.socket.emit('env-validation-request', request)

      const timeout = setTimeout(() => {
        reject(new Error('Environment validation timeout'))
      }, 10000)

      this.once('env-validation-response', (response: EnvValidationResponse) => {
        clearTimeout(timeout)
        console.log('[Tunnel Client] Environment validation complete')
        resolve(response)
      })
    })
  }

  // ==========================================================================
  // Health Check
  // ==========================================================================

  public async healthCheck(): Promise<HealthCheckResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new TunnelConnectionError('Not connected'))
        return
      }

      this.socket.emit('health-check')

      const timeout = setTimeout(() => {
        reject(new Error('Health check timeout'))
      }, 5000)

      this.once('health-check', (health: HealthCheckResponse) => {
        clearTimeout(timeout)
        resolve(health)
      })
    })
  }

  // ==========================================================================
  // Utilities
  // ==========================================================================

  public isConnected(): boolean {
    return this.socket !== null && this.socket.connected && this.isAuthenticated
  }

  public getStatus() {
    return {
      connected: this.socket?.connected || false,
      authenticated: this.isAuthenticated,
      reconnectAttempt: this.reconnectAttempt,
    }
  }
}

export default TunnelClient
