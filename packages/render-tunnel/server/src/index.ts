/**
 * Render Tunnel Server
 * Runs on production (Render) to accept connections from local development
 *
 * ✅ PHASE 3: Render-Local Data Tunnel
 */

import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'
import type {
  TunnelAuthPayload,
  TunnelAuthResponse,
  TunnelServerConfig,
  LogEntry,
  WebhookPayload,
  DataSyncRequest,
  DataSyncResponse,
  FeatureFlagSync,
  EnvValidationRequest,
  EnvValidationResponse,
  HealthCheckResponse,
} from '@aiwhisperers/render-tunnel/types'

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_CONFIG: TunnelServerConfig = {
  port: 3001,
  secret: process.env.RENDER_TUNNEL_SECRET || 'dev-secret-change-me',
  cors: {
    origin: process.env.RENDER_TUNNEL_CORS_ORIGIN || '*',
    credentials: true,
  },
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
  },
  logRetention: 60 * 60 * 1000, // 1 hour
  environment: (process.env.NODE_ENV as 'development' | 'production') || 'production',
}

// ============================================================================
// Tunnel Server Class
// ============================================================================

export class TunnelServer {
  private io: SocketIOServer
  private httpServer: ReturnType<typeof createServer>
  private config: TunnelServerConfig
  private startTime: number
  private logs: LogEntry[] = []
  private authenticatedClients = new Set<string>()

  constructor(config: Partial<TunnelServerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.startTime = Date.now()

    // Create HTTP server
    this.httpServer = createServer((req, res) => {
      if (req.url === '/health') {
        this.handleHealthCheck(req, res)
      } else {
        res.writeHead(404)
        res.end('Not found')
      }
    })

    // Create Socket.IO server
    this.io = new SocketIOServer(this.httpServer, {
      cors: this.config.cors,
      path: '/render-tunnel',
      transports: ['websocket', 'polling'],
    })

    this.setupEventHandlers()
  }

  // ==========================================================================
  // Setup
  // ==========================================================================

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`[Tunnel] Client connected: ${socket.id}`)

      // Authentication
      socket.on('authenticate', (payload: TunnelAuthPayload) => {
        this.handleAuthentication(socket, payload)
      })

      // Logs
      socket.on('log', (entry: LogEntry) => {
        this.handleLog(entry)
      })

      // Webhooks
      socket.on('webhook', (payload: WebhookPayload) => {
        this.handleWebhook(socket, payload)
      })

      // Data sync
      socket.on('data-sync-request', (request: DataSyncRequest) => {
        this.handleDataSync(socket, request)
      })

      // Feature flags
      socket.on('feature-flag-sync', () => {
        this.handleFeatureFlagSync(socket)
      })

      // Environment validation
      socket.on('env-validation-request', (request: EnvValidationRequest) => {
        this.handleEnvValidation(socket, request)
      })

      // Health check
      socket.on('health-check', () => {
        this.handleSocketHealthCheck(socket)
      })

      // Disconnect
      socket.on('disconnect', () => {
        console.log(`[Tunnel] Client disconnected: ${socket.id}`)
        this.authenticatedClients.delete(socket.id)
      })
    })
  }

  // ==========================================================================
  // Authentication
  // ==========================================================================

  private handleAuthentication(socket: any, payload: TunnelAuthPayload): void {
    const isValid = this.validateAuth(payload)

    const response: TunnelAuthResponse = {
      success: isValid,
      message: isValid ? 'Authentication successful' : 'Invalid secret',
      serverId: socket.id,
      serverVersion: '0.1.0',
    }

    if (isValid) {
      this.authenticatedClients.add(socket.id)
      console.log(`[Tunnel] Client authenticated: ${socket.id}`)
    } else {
      console.warn(`[Tunnel] Authentication failed: ${socket.id}`)
    }

    socket.emit('authenticated', response)

    if (!isValid) {
      setTimeout(() => socket.disconnect(), 1000)
    }
  }

  private validateAuth(payload: TunnelAuthPayload): boolean {
    // Check secret
    if (payload.secret !== this.config.secret) {
      return false
    }

    // Check timestamp (prevent replay attacks - 5 minute window)
    const now = Date.now()
    const timeDiff = Math.abs(now - payload.timestamp)
    if (timeDiff > 5 * 60 * 1000) {
      return false
    }

    return true
  }

  private isAuthenticated(socket: any): boolean {
    return this.authenticatedClients.has(socket.id)
  }

  // ==========================================================================
  // Logging
  // ==========================================================================

  private handleLog(entry: LogEntry): void {
    // Add to in-memory store
    this.logs.push(entry)

    // Broadcast to all authenticated clients
    this.broadcastToAuthenticated('log', entry)

    // Cleanup old logs
    this.cleanupLogs()

    // Log to console in development
    if (this.config.environment === 'development') {
      console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.context || '')
    }
  }

  private cleanupLogs(): void {
    const now = Date.now()
    const cutoff = now - this.config.logRetention
    this.logs = this.logs.filter((log) => log.timestamp > cutoff)
  }

  // ==========================================================================
  // Webhooks
  // ==========================================================================

  private handleWebhook(socket: any, payload: WebhookPayload): void {
    if (!this.isAuthenticated(socket)) {
      socket.emit('error', { message: 'Not authenticated' })
      return
    }

    console.log(`[Tunnel] Webhook received: ${payload.provider} - ${payload.event}`)

    // Forward webhook to all authenticated clients
    this.broadcastToAuthenticated('webhook', payload)

    // Acknowledge receipt
    socket.emit('webhook-ack', {
      provider: payload.provider,
      event: payload.event,
      timestamp: Date.now(),
    })
  }

  // ==========================================================================
  // Data Sync
  // ==========================================================================

  private async handleDataSync(socket: any, request: DataSyncRequest): Promise<void> {
    if (!this.isAuthenticated(socket)) {
      socket.emit('error', { message: 'Not authenticated' })
      return
    }

    try {
      // This is a placeholder - in real implementation, this would query the database
      const response: DataSyncResponse = {
        table: request.table,
        data: [],
        count: 0,
        sanitized: request.sanitize,
        timestamp: Date.now(),
      }

      console.log(`[Tunnel] Data sync request: ${request.table} (limit: ${request.limit || 'all'})`)

      socket.emit('data-sync-response', response)
    } catch (error) {
      socket.emit('error', {
        message: 'Data sync failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  // ==========================================================================
  // Feature Flags
  // ==========================================================================

  private handleFeatureFlagSync(socket: any): void {
    if (!this.isAuthenticated(socket)) {
      socket.emit('error', { message: 'Not authenticated' })
      return
    }

    // This is a placeholder - in real implementation, this would query feature flags
    const sync: FeatureFlagSync = {
      flags: [
        {
          key: 'ENABLE_STRIPE',
          enabled: process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true',
          description: 'Enable Stripe payment processing',
          environment: 'all',
        },
        {
          key: 'ENABLE_AI_CHAT',
          enabled: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT === 'true',
          description: 'Enable AI chatbot',
          environment: 'all',
        },
      ],
      timestamp: Date.now(),
      environment: this.config.environment,
    }

    console.log(`[Tunnel] Feature flag sync: ${sync.flags.length} flags`)

    socket.emit('feature-flag-sync', sync)
  }

  // ==========================================================================
  // Environment Validation
  // ==========================================================================

  private handleEnvValidation(socket: any, request: EnvValidationRequest): void {
    if (!this.isAuthenticated(socket)) {
      socket.emit('error', { message: 'Not authenticated' })
      return
    }

    const missing: string[] = []
    const warnings: string[] = []

    request.variables.forEach((key) => {
      if (!process.env[key]) {
        missing.push(key)
      }
    })

    const response: EnvValidationResponse = {
      missing,
      mismatched: [],
      warnings,
      timestamp: Date.now(),
    }

    console.log(`[Tunnel] Environment validation: ${missing.length} missing variables`)

    socket.emit('env-validation-response', response)
  }

  // ==========================================================================
  // Health Checks
  // ==========================================================================

  private handleHealthCheck(req: any, res: any): void {
    const health: HealthCheckResponse = {
      status: 'healthy',
      uptime: Date.now() - this.startTime,
      connectedClients: this.authenticatedClients.size,
      version: '0.1.0',
      environment: this.config.environment,
      checks: {
        database: true, // Placeholder
        api: true,
      },
      timestamp: Date.now(),
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(health, null, 2))
  }

  private handleSocketHealthCheck(socket: any): void {
    const health: HealthCheckResponse = {
      status: 'healthy',
      uptime: Date.now() - this.startTime,
      connectedClients: this.authenticatedClients.size,
      version: '0.1.0',
      environment: this.config.environment,
      checks: {
        database: true,
        api: true,
      },
      timestamp: Date.now(),
    }

    socket.emit('health-check', health)
  }

  // ==========================================================================
  // Utilities
  // ==========================================================================

  private broadcastToAuthenticated(event: string, data: any): void {
    this.authenticatedClients.forEach((clientId) => {
      this.io.to(clientId).emit(event, data)
    })
  }

  // ==========================================================================
  // Public API
  // ==========================================================================

  public start(): Promise<void> {
    return new Promise((resolve) => {
      this.httpServer.listen(this.config.port, () => {
        console.log(`
╔════════════════════════════════════════════════════════════════╗
║  Render Tunnel Server                                          ║
╠════════════════════════════════════════════════════════════════╣
║  Status:       RUNNING                                         ║
║  Port:         ${this.config.port}                                         ║
║  Environment:  ${this.config.environment}                               ║
║  Path:         /render-tunnel                                  ║
╚════════════════════════════════════════════════════════════════╝
        `)
        resolve()
      })
    })
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      this.io.close(() => {
        this.httpServer.close(() => {
          console.log('[Tunnel] Server stopped')
          resolve()
        })
      })
    })
  }

  public getStats() {
    return {
      connectedClients: this.authenticatedClients.size,
      uptime: Date.now() - this.startTime,
      logCount: this.logs.length,
    }
  }
}

// ============================================================================
// Standalone Server (for testing)
// ============================================================================

if (require.main === module) {
  const server = new TunnelServer()
  server.start()

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('[Tunnel] SIGTERM received, shutting down...')
    await server.stop()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    console.log('[Tunnel] SIGINT received, shutting down...')
    await server.stop()
    process.exit(0)
  })
}

export default TunnelServer
