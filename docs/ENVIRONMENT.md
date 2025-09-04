# AI Whisperers - Environment Configuration

## 🌐 Environment Variables Guide (Updated)

The AI Whisperers platform uses **minimal environment configuration** optimized for deployment simplicity. The application works with zero configuration and gracefully enhances functionality when additional environment variables are provided.

### 📋 Environment Variable Categories

#### **🔴 REQUIRED Variables**
Variables that must be set for production deployment:

| Variable | Purpose | Example | Notes |
|----------|---------|---------|-------|
| `NEXTAUTH_SECRET` | JWT signing secret | `base64-random-string` | Generate 32+ chars |
| `NEXTAUTH_URL` | Application base URL | `https://app.onrender.com` | Auto-configured on Render |

#### **🟡 OPTIONAL Variables**  
Variables that enhance functionality when present:

| Variable | Purpose | Example | Notes |
|----------|---------|---------|-------|
| `GOOGLE_CLIENT_ID` | Google OAuth | `123456789-abc.googleusercontent.com` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | `GOCSPX-abcdefghijk` | Keep secure |
| `GITHUB_CLIENT_ID` | GitHub OAuth | `Ov23liAbCdEfGhIjKl` | From GitHub Developer |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Secret | `1234567890abcdef` | Keep secure |
| `EMAIL_SERVER_HOST` | SMTP Server | `smtp.gmail.com` | For magic link emails |
| `EMAIL_SERVER_PORT` | SMTP Port | `587` | Usually 587 or 465 |
| `EMAIL_SERVER_USER` | SMTP Username | `user@gmail.com` | SMTP account |
| `EMAIL_SERVER_PASSWORD` | SMTP Password | `app-specific-password` | App password, not regular password |
| `EMAIL_FROM` | From Email Address | `noreply@yourdomain.com` | Sender email |

#### **🟢 AUTOMATIC Variables**
Variables automatically configured by deployment platform:

| Variable | Purpose | Render Configuration |
|----------|---------|---------------------|
| `NODE_ENV` | Environment mode | Automatically set to "production" |
| `PORT` | Server port | Automatically assigned by Render |
| `RENDER_EXTERNAL_URL` | External URL | Automatically provided |

## 🚀 Environment Setup Guides

### Local Development Setup

#### **Minimal Setup** (Recommended for Quick Start):
```bash
# No environment variables needed!
npm run dev
# Application works with JWT authentication disabled
```

#### **OAuth Development Setup**:
```bash
# Copy template
cp .env.example .env

# Edit .env file
NEXTAUTH_SECRET="development-secret-only-not-production"
NEXTAUTH_URL="http://localhost:3000"

# Add OAuth providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### **Full Development Setup**:
```bash
# All features enabled
NEXTAUTH_SECRET="development-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"  
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### Production Environment Setup

#### **Render.com Configuration**:

**Required Environment Variables**:
```bash
# In Render Dashboard → Environment
NEXTAUTH_SECRET → Click "Generate Value" (32+ character random string)
NEXTAUTH_URL → Select "Service URL" (automatic)
```

**Optional OAuth Setup**:
```bash
# Add these manually for OAuth functionality
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 🔐 Environment Variable Security

### Security Best Practices

1. **Never Commit Secrets**: `.env` files are gitignored
2. **Use Strong Secrets**: Generate cryptographically secure secrets
3. **Environment Separation**: Different secrets for development/production
4. **Secret Rotation**: Rotate secrets periodically
5. **Minimal Exposure**: Only set variables you actually need

### Secret Generation

**NEXTAUTH_SECRET Generation**:
```bash
# Method 1: Node.js crypto
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 2: OpenSSL
openssl rand -base64 32

# Method 3: Use Render's "Generate Value" (recommended)
```

**OAuth Client ID/Secret**: Obtain from provider developer consoles

### Environment Validation

**Automatic Validation**: The application validates environment variables at startup:

```typescript
// Environment validation in auth config
function validateEnvVar(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value.trim()
}
```

**Graceful Degradation**: Missing OAuth variables result in warnings, not crashes:
```
console.warn('Google OAuth not configured:', error)
console.warn('GitHub OAuth not configured:', error)
```

## 🔧 Environment Configuration Patterns

### Conditional Feature Configuration

**OAuth Provider Conditional Loading**:
```typescript
// Only enable providers if environment variables exist
const providers = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({ ... }))
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(GitHubProvider({ ... }))
}
```

**Benefits**:
- Application works with partial configuration
- Easy to enable/disable features via environment variables
- No runtime crashes from missing configuration

### Development vs Production Configuration

**Development**:
- Simple secrets (clearly marked as development-only)
- Optional OAuth for testing
- Detailed error messages
- Hot reloading enabled

**Production**:
- Secure generated secrets
- Production OAuth credentials  
- Error logging without sensitive data exposure
- Optimized performance

## 🌍 Multi-Environment Support

### Environment File Structure

```bash
# Development
.env.local         # Local development (gitignored)
.env.example       # Template file (committed)

# Production  
Render Dashboard   # Environment variables panel
# No files needed - all configured in Render UI
```

### Environment Loading Priority

Next.js loads environment variables in this order:
1. `process.env` (system environment)
2. `.env.local` (local overrides)
3. `.env` (general configuration)
4. `.env.example` (template only)

### Multi-Language Environment

**No Special Configuration**: The application automatically detects content language from YAML files:
```yaml
# In content files
meta:
  language: "en"    # English content
  language: "es"    # Spanish content
```

## 🚀 Deployment Environment Configuration

### Render.com Environment Setup

**Automatic Configuration** (render.yaml):
```yaml
envVars:
  - key: NODE_ENV
    value: production
  - key: NEXTAUTH_SECRET
    generateValue: true        # Render generates secure secret
  - key: NEXTAUTH_URL
    fromService:               # Render provides service URL
      type: web
      name: ai-whisperers-web
      property: host
```

**Manual Configuration**: Add OAuth credentials in Render Dashboard

### Environment Testing

**Local Environment Test**:
```bash
# Test without environment variables
unset NEXTAUTH_SECRET
npm run dev
# Verify application starts (with warnings)

# Test with environment variables
export NEXTAUTH_SECRET="test-secret"
npm run dev
# Verify authentication works
```

**Production Environment Test**:
```bash
# Test production build locally
NODE_ENV=production npm run build
npm start

# Verify health check
curl http://localhost:3000/api/health
```

## 🛠️ Environment Troubleshooting

### Common Environment Issues

#### **1. Missing NEXTAUTH_SECRET**
**Error**: `Missing required environment variable: NEXTAUTH_SECRET`
**Solution**: Generate and set secure secret
```bash
# Generate secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Set in environment
export NEXTAUTH_SECRET="generated-secret"
```

#### **2. OAuth Redirect Mismatch**
**Error**: OAuth authentication fails with redirect URI mismatch
**Solution**: Update OAuth provider settings
```bash
# Check current URL
echo $NEXTAUTH_URL

# Verify OAuth provider redirect URLs match:
# Development: http://localhost:3000/api/auth/callback/[provider]
# Production: https://your-app.onrender.com/api/auth/callback/[provider]
```

#### **3. Email Provider Configuration**
**Error**: Email authentication not working
**Solution**: Verify SMTP settings
```bash
# Test SMTP connection (requires additional tools)
# Or use Gmail App Password instead of regular password
```

### Environment Debugging

**Environment Variable Inspection**:
```bash
# Check environment variables (safe - no secrets shown)
npm run dev 2>&1 | grep -i "warn\|error" | grep -i "configured"

# Expected output:
# "Google OAuth not configured: Error: Missing..." (if not configured)
# "GitHub OAuth not configured: Error: Missing..." (if not configured)
```

**Authentication Provider Testing**:
```bash
# Test authentication providers
curl http://localhost:3000/api/auth/providers

# Expected response includes configured providers only
```

## 📊 Environment Monitoring

### Environment Health Checks

**Startup Validation**: Application validates environment on startup
**Runtime Checks**: Authentication providers checked during use
**Health Endpoint**: `/api/health` includes environment status

**Monitoring Commands**:
```bash
# Check environment variable loading
curl -s http://localhost:3000/api/health | jq '.environment'

# Monitor authentication providers
curl -s http://localhost:3000/api/auth/providers | jq 'keys'
```

### Environment Change Detection

**Development**: Changes to .env require server restart
**Production**: Changes in Render Dashboard trigger automatic redeployment

---

## 📚 Related Documentation

- **Getting Started**: [Development Setup](./GETTING_STARTED.md)
- **Deployment**: [Deployment Guide](./DEPLOYMENT.md)
- **Authentication**: [Authentication System](./AUTHENTICATION.md)
- **Troubleshooting**: [Troubleshooting Guide](./TROUBLESHOOTING.md)

*This environment configuration guide reflects the simplified architecture as of September 4, 2025, with minimal required configuration and optional feature enhancement.*