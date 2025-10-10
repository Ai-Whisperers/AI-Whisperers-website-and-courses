/**
 * Shared TypeScript types for Render-Local Tunnel
 *
 * ✅ PHASE 3: Render-Local Data Tunnel
 */

// ============================================================================
// Event Types
// ============================================================================

export type TunnelEvent =
  | 'connect'
  | 'disconnect'
  | 'error'
  | 'authenticate'
  | 'authenticated'
  | 'log'
  | 'webhook'
  | 'data-sync-request'
  | 'data-sync-response'
  | 'feature-flag-sync'
  | 'env-validation-request'
  | 'env-validation-response'
  | 'health-check'

// ============================================================================
// Authentication
// ============================================================================

export interface TunnelAuthPayload {
  secret: string
  environment: 'development' | 'production'
  timestamp: number
}

export interface TunnelAuthResponse {
  success: boolean
  message: string
  serverId?: string
  serverVersion?: string
}

// ============================================================================
// Logging
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: number
  context?: Record<string, unknown>
  service: string
  environment: 'development' | 'production'
}

export interface LogStreamOptions {
  follow?: boolean
  filter?: LogLevel
  service?: string
  since?: number
  tail?: number
}

// ============================================================================
// Webhooks
// ============================================================================

export type WebhookProvider = 'stripe' | 'paypal' | 'resend' | 'custom'

export interface WebhookPayload {
  provider: WebhookProvider
  event: string
  data: unknown
  headers: Record<string, string>
  timestamp: number
  signature?: string
}

export interface WebhookForwardConfig {
  provider: WebhookProvider
  localPort: number
  localPath: string
  verifySignature: boolean
}

// ============================================================================
// Data Sync
// ============================================================================

export type SyncTable =
  | 'courses'
  | 'users'
  | 'enrollments'
  | 'payments'
  | 'content'
  | 'sessions'

export interface DataSyncRequest {
  table: SyncTable
  limit?: number
  where?: Record<string, unknown>
  select?: string[]
  sanitize: boolean
}

export interface DataSyncResponse {
  table: SyncTable
  data: unknown[]
  count: number
  sanitized: boolean
  timestamp: number
}

// ============================================================================
// Feature Flags
// ============================================================================

export interface FeatureFlag {
  key: string
  enabled: boolean
  description?: string
  environment?: 'development' | 'production' | 'all'
  rolloutPercentage?: number
}

export interface FeatureFlagSync {
  flags: FeatureFlag[]
  timestamp: number
  environment: 'development' | 'production'
}

// ============================================================================
// Environment Validation
// ============================================================================

export interface EnvVariable {
  key: string
  value?: string
  required: boolean
  sensitive: boolean
  description?: string
}

export interface EnvValidationRequest {
  variables: string[]
}

export interface EnvValidationResponse {
  missing: string[]
  mismatched: Array<{
    key: string
    local: string | undefined
    production: string | undefined
  }>
  warnings: string[]
  timestamp: number
}

// ============================================================================
// Health Check
// ============================================================================

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded'
  uptime: number
  connectedClients: number
  version: string
  environment: 'development' | 'production'
  checks: {
    database: boolean
    redis?: boolean
    api: boolean
  }
  timestamp: number
}

// ============================================================================
// Tunnel Configuration
// ============================================================================

export interface TunnelServerConfig {
  port: number
  secret: string
  cors: {
    origin: string | string[]
    credentials: boolean
  }
  rateLimit: {
    windowMs: number
    max: number
  }
  logRetention: number // milliseconds
  environment: 'development' | 'production'
}

export interface TunnelClientConfig {
  serverUrl: string
  secret: string
  reconnect: boolean
  reconnectAttempts: number
  reconnectDelay: number
  environment: 'development' | 'production'
}

// ============================================================================
// CLI Types
// ============================================================================

export interface CLIOptions {
  server?: string
  secret?: string
  env?: string
  verbose?: boolean
}

export interface CLILogsOptions extends CLIOptions {
  follow?: boolean
  filter?: LogLevel
  service?: string
  tail?: number
}

export interface CLIWebhookOptions extends CLIOptions {
  type: WebhookProvider
  port: number
  path?: string
  verify?: boolean
}

export interface CLISyncOptions extends CLIOptions {
  table: SyncTable
  limit?: number
  sanitize?: boolean
  output?: string
}

// ============================================================================
// Error Types
// ============================================================================

export class TunnelError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'TunnelError'
  }
}

export class TunnelAuthError extends TunnelError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'TUNNEL_AUTH_ERROR', 401)
    this.name = 'TunnelAuthError'
  }
}

export class TunnelConnectionError extends TunnelError {
  constructor(message: string = 'Connection failed') {
    super(message, 'TUNNEL_CONNECTION_ERROR', 503)
    this.name = 'TunnelConnectionError'
  }
}

export class TunnelValidationError extends TunnelError {
  constructor(message: string = 'Validation failed') {
    super(message, 'TUNNEL_VALIDATION_ERROR', 400)
    this.name = 'TunnelValidationError'
  }
}
