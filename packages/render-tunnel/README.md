# @aiwhisperers/render-tunnel

**Render-Local Data Tunnel for Development/Production Parity**

> ✅ **PHASE 3**: Bidirectional WebSocket tunnel between Render.com production and local development environments

## 📋 Overview

The Render Tunnel provides a secure, real-time connection between your production environment (Render.com) and local development machine. This enables:

- **Live Log Streaming**: Stream production logs to your local terminal
- **Webhook Forwarding**: Forward production webhooks (Stripe, PayPal, etc.) to localhost
- **Data Synchronization**: Pull production data to local database (sanitized)
- **Feature Flag Sync**: Mirror production feature flags in development
- **Environment Validation**: Verify local environment matches production
- **Health Monitoring**: Real-time production server health checks

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production (Render.com)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Tunnel Server (Socket.IO)                    │  │
│  │  - Port: 3001                                        │  │
│  │  - Path: /render-tunnel                             │  │
│  │  - Auth: Secret + Timestamp validation              │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │ WebSocket (wss://)
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Tunnel Client (Socket.IO Client)             │  │
│  │  - Auto-reconnect                                    │  │
│  │  - Event-based architecture                          │  │
│  │  - Token authentication                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│                 Local Development (localhost)                │
└──────────────────────────────────────────────────────────────┘
```

## 📦 Package Structure

```
@aiwhisperers/render-tunnel/
├── server/           # Production tunnel server (Render.com)
├── client/           # Local development client
├── cli/              # Command-line interface
└── types/            # Shared TypeScript types
```

## 🚀 Installation

```bash
# Install dependencies (from workspace root)
pnpm install

# Or install just this package
cd packages/render-tunnel
pnpm install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in your workspace root:

```bash
# Production (Render.com)
RENDER_EXTERNAL_URL=https://your-app.onrender.com
RENDER_TUNNEL_SECRET=your-secure-secret-key-change-me

# Local Development
RENDER_TUNNEL_SECRET=your-secure-secret-key-change-me
```

### Security

The tunnel uses **two-factor authentication**:

1. **Secret Key**: Shared secret between server and client
2. **Timestamp Validation**: 5-minute window to prevent replay attacks

```typescript
// Authentication payload
{
  secret: process.env.RENDER_TUNNEL_SECRET,
  environment: 'development',
  timestamp: Date.now()  // Must be within 5 minutes
}
```

## 🖥️ CLI Usage

### Connect to Tunnel

```bash
# Basic connection
pnpm tunnel connect

# With custom server
pnpm tunnel connect --server https://your-app.onrender.com
```

### Stream Logs

```bash
# Stream all logs
pnpm tunnel logs

# Filter by log level
pnpm tunnel logs --filter error

# Filter by service
pnpm tunnel logs --service api

# Show last 50 lines
pnpm tunnel logs --tail 50
```

### Forward Webhooks

```bash
# Forward Stripe webhooks to local port 3000
pnpm tunnel webhook --type stripe --port 3000

# Custom webhook path
pnpm tunnel webhook --type stripe --port 3000 --path /api/webhooks/stripe
```

### Sync Data

```bash
# Sync courses table (sanitized)
pnpm tunnel sync --table courses

# Limit rows
pnpm tunnel sync --table users --limit 50

# Output to file
pnpm tunnel sync --table enrollments --output data.json

# Disable sanitization (use with caution)
pnpm tunnel sync --table payments --no-sanitize
```

### Feature Flags

```bash
# Sync feature flags
pnpm tunnel flags

# Output to file
pnpm tunnel flags --output flags.json
```

### Environment Validation

```bash
# Validate specific variables
pnpm tunnel validate-env DATABASE_URL STRIPE_SECRET_KEY

# Checks if variables exist and match between local/prod
```

### Health Check

```bash
# Check tunnel server health
pnpm tunnel health
```

## 📚 Programmatic API

### Server (Production)

```typescript
import { TunnelServer } from '@aiwhisperers/render-tunnel/server'

const server = new TunnelServer({
  port: 3001,
  secret: process.env.RENDER_TUNNEL_SECRET,
  cors: {
    origin: process.env.RENDER_TUNNEL_CORS_ORIGIN || '*',
    credentials: true,
  },
  rateLimit: {
    windowMs: 60 * 1000,  // 1 minute
    max: 100,              // 100 requests per minute
  },
  logRetention: 60 * 60 * 1000,  // 1 hour
  environment: 'production',
})

await server.start()
console.log('Tunnel server running on port 3001')

// Graceful shutdown
process.on('SIGTERM', async () => {
  await server.stop()
  process.exit(0)
})
```

### Client (Local Development)

```typescript
import { TunnelClient } from '@aiwhisperers/render-tunnel/client'

const client = new TunnelClient({
  serverUrl: process.env.RENDER_EXTERNAL_URL,
  secret: process.env.RENDER_TUNNEL_SECRET,
  reconnect: true,
  reconnectAttempts: 5,
  reconnectDelay: 3000,
  environment: 'development',
})

// Connect
await client.connect()

// Stream logs
client.streamLogs({
  filter: 'error',
  service: 'api',
  follow: true,
})

// Forward webhooks
await client.forwardWebhook('stripe', 3000, '/api/webhooks/stripe')

// Sync data
const response = await client.syncData({
  table: 'courses',
  limit: 100,
  sanitize: true,
})

// Feature flags
const flags = await client.syncFeatureFlags()

// Environment validation
const validation = await client.validateEnv([
  'DATABASE_URL',
  'STRIPE_SECRET_KEY',
])

// Health check
const health = await client.healthCheck()

// Disconnect
client.disconnect()
```

### Event Handling

```typescript
// Connection events
client.on('authenticated', (response) => {
  console.log('Authenticated:', response.serverId)
})

client.on('disconnect', (reason) => {
  console.log('Disconnected:', reason)
})

client.on('error', (error) => {
  console.error('Error:', error)
})

// Data events
client.on('log', (entry) => {
  console.log(`[${entry.level}] ${entry.message}`)
})

client.on('webhook', (payload) => {
  console.log(`Webhook: ${payload.provider} - ${payload.event}`)
})

client.on('feature-flag-sync', (sync) => {
  console.log(`Synced ${sync.flags.length} feature flags`)
})

client.on('health-check', (health) => {
  console.log(`Server health: ${health.status}`)
})
```

## 🔧 Development

### Run Server (Development)

```bash
pnpm dev:server
```

### Run Client (Development)

```bash
pnpm dev:client
```

### Build

```bash
pnpm build
```

## 📡 Event Types

### Client → Server

| Event                    | Description                      |
| ------------------------ | -------------------------------- |
| `authenticate`           | Authenticate with secret         |
| `log-stream-start`       | Start streaming logs             |
| `log-stream-stop`        | Stop streaming logs              |
| `data-sync-request`      | Request data synchronization     |
| `feature-flag-sync`      | Request feature flags            |
| `env-validation-request` | Validate environment variables   |
| `health-check`           | Request server health status     |

### Server → Client

| Event                    | Description                      |
| ------------------------ | -------------------------------- |
| `authenticated`          | Authentication response          |
| `log`                    | Log entry                        |
| `webhook`                | Webhook payload                  |
| `data-sync-response`     | Data synchronization response    |
| `feature-flag-sync`      | Feature flags response           |
| `env-validation-response`| Environment validation response  |
| `health-check`           | Health check response            |
| `error`                  | Error event                      |

## 🔒 Security Considerations

### Authentication

- **Secret-based authentication**: Shared secret between client and server
- **Timestamp validation**: 5-minute window prevents replay attacks
- **Auto-disconnect**: Failed authentication results in automatic disconnect

### Data Sanitization

When syncing production data, the tunnel automatically sanitizes sensitive information:

```typescript
const response = await client.syncData({
  table: 'users',
  sanitize: true,  // Remove emails, passwords, tokens, etc.
})
```

### Rate Limiting

The server implements rate limiting to prevent abuse:

```typescript
{
  rateLimit: {
    windowMs: 60 * 1000,  // 1 minute window
    max: 100,              // Max 100 requests per window
  }
}
```

### CORS Configuration

Production server should restrict CORS origins:

```bash
# .env (Production)
RENDER_TUNNEL_CORS_ORIGIN=https://localhost:3000,http://localhost:3000
```

## 🎯 Use Cases

### 1. Debug Production Issues Locally

```bash
# Stream production error logs
pnpm tunnel logs --filter error --follow
```

### 2. Test Webhook Integrations

```bash
# Forward Stripe webhooks to local development
pnpm tunnel webhook --type stripe --port 3000

# Your local server receives real production webhooks
# at http://localhost:3000/api/webhooks
```

### 3. Reproduce Production Data

```bash
# Sync recent enrollments to local database
pnpm tunnel sync --table enrollments --limit 100

# Data is automatically sanitized (PII removed)
```

### 4. Verify Feature Flag Parity

```bash
# Check if local feature flags match production
pnpm tunnel flags

# Output:
# ✓ ON   ENABLE_STRIPE
# ✗ OFF  ENABLE_AI_CHAT
```

### 5. Environment Validation

```bash
# Ensure all required env vars are set
pnpm tunnel validate-env \
  DATABASE_URL \
  STRIPE_SECRET_KEY \
  NEXTAUTH_SECRET

# Reports missing or mismatched variables
```

## 🐛 Troubleshooting

### Connection Refused

```bash
# Check if server is running
curl https://your-app.onrender.com/health

# Verify RENDER_EXTERNAL_URL is correct
echo $RENDER_EXTERNAL_URL
```

### Authentication Failed

```bash
# Verify secrets match between client and server
echo $RENDER_TUNNEL_SECRET

# Check timestamp isn't too far off (NTP sync)
date -u
```

### Webhook Not Forwarding

```bash
# Ensure local server is running
curl http://localhost:3000/api/webhooks

# Check webhook provider configuration
# Stripe: Dashboard → Webhooks → Add endpoint
# URL: https://your-app.onrender.com/api/webhooks/stripe
```

### Data Sync Timeout

```bash
# Reduce limit if syncing large tables
pnpm tunnel sync --table courses --limit 50

# Check production database connection
pnpm tunnel health
```

## 📝 Type Definitions

All types are available from `@aiwhisperers/render-tunnel/types`:

```typescript
import type {
  TunnelEvent,
  TunnelAuthPayload,
  TunnelAuthResponse,
  LogEntry,
  LogLevel,
  WebhookPayload,
  WebhookProvider,
  DataSyncRequest,
  DataSyncResponse,
  FeatureFlagSync,
  EnvValidationRequest,
  EnvValidationResponse,
  HealthCheckResponse,
  TunnelServerConfig,
  TunnelClientConfig,
  TunnelError,
  TunnelAuthError,
  TunnelConnectionError,
} from '@aiwhisperers/render-tunnel/types'
```

## 🚦 Status Codes

| Code | Class                      | Description                     |
| ---- | -------------------------- | ------------------------------- |
| 400  | `TunnelValidationError`    | Invalid request parameters      |
| 401  | `TunnelAuthError`          | Authentication failed           |
| 503  | `TunnelConnectionError`    | Connection failed/timeout       |
| 500  | `TunnelError`              | Generic tunnel error            |

## 🔄 Migration Path

This tunnel system is designed for **Phases 0-6** (Hybrid Next.js Monolith). When migrating to **Phase 7+** (Microservices), the tunnel architecture will evolve:

```
Phase 0-6 (Current):
- Single Next.js app with API routes
- Tunnel connects to Next.js server

Phase 7+ (Future):
- Separate frontend and backend services
- Tunnel may need multi-service support
```

## 📊 Performance Metrics

- **Connection Time**: ~500ms (initial auth + handshake)
- **Log Latency**: ~100ms (WebSocket overhead)
- **Data Sync**: Varies by table size (1000 rows ~2s)
- **Feature Flags**: ~200ms (small payload)
- **Health Check**: ~100ms (ping/pong)

## 🤝 Contributing

This package is part of the AI Whisperers Platform monorepo. See the main repository for contribution guidelines.

## 📄 License

Private - AI Whisperers Platform

---

**⚠️ Important**: This tunnel provides direct access to production data. Always:
- Use sanitization when syncing sensitive data
- Rotate tunnel secrets regularly
- Monitor tunnel usage for suspicious activity
- Never commit `.env` files with production secrets
