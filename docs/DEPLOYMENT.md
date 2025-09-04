# AI Whisperers - Render.com Deployment Guide

## 🚀 Deployment Overview

This guide provides comprehensive instructions for deploying the AI Whisperers educational platform to **Render.com**. The platform requires a web service for the Next.js application and a PostgreSQL database.

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    RENDER.COM SERVICES                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐    ┌─────────────────┐           │
│  │   Web Service   │    │   PostgreSQL    │           │
│  │   (Next.js)     │────│    Database     │           │
│  │                 │    │                 │           │
│  │ • Next.js App   │    │ • Course Data   │           │
│  │ • API Routes    │    │ • User Data     │           │
│  │ • Static Assets │    │ • Session Data  │           │
│  └─────────────────┘    └─────────────────┘           │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │              External Integrations               ││
│  │                                                   ││
│  │ • NextAuth.js (OAuth Providers)                   ││
│  │ • Email Service (Optional: ConvertKit/Resend)     ││
│  │ • Payment Processing (Optional: PayPal/Stripe)    ││
│  │ • AI Services (Optional: OpenAI/Anthropic)        ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

### Required Accounts
1. **GitHub Account**: Source code repository
2. **Render Account**: Cloud deployment platform
3. **OAuth Providers** (one or more):
   - Google Cloud Console (Google OAuth)
   - GitHub Developer Settings (GitHub OAuth)

### Optional Service Accounts
- **Email Service**: ConvertKit, Resend, or SMTP
- **Payment Processing**: PayPal Developer, Stripe
- **AI Services**: OpenAI API, Anthropic Claude API

## 🗄️ Database Setup

### Step 1: Create PostgreSQL Database

1. **Log in to Render Dashboard**
   - Navigate to [render.com](https://render.com)
   - Sign in or create account

2. **Create New PostgreSQL Service**
   ```
   Dashboard → New → PostgreSQL
   ```

3. **Configure Database Settings**
   ```
   Name: aiwhisperers-db
   Database: aiwhisperers_production
   User: aiwhisperers_user
   Region: Choose closest to your users
   PostgreSQL Version: 14
   Plan: Starter ($7/month) or higher
   ```

4. **Save Database Configuration**
   - Render will provision the database
   - Note the connection details provided

5. **Copy Database URL**
   ```
   Internal Database URL: 
   postgresql://username:password@hostname:port/database
   
   External Database URL:
   postgresql://username:password@external-hostname:port/database
   ```

### Step 2: Database Configuration Notes

- **Internal URL**: Use for Render web services (faster, no external traffic)
- **External URL**: Use for local development and external tools
- **Automatic Backups**: Enabled by default
- **Connection Pooling**: Available in paid plans

## 🌐 Web Service Deployment

### Step 1: Prepare Repository

1. **Ensure Repository is Public** (or upgrade Render plan for private repos)
   
2. **Create Production Environment File**
   ```bash
   # Create .env.production (do not commit)
   # This is for reference only - set in Render dashboard
   ```

3. **Verify Build Scripts**
   ```json
   {
     "scripts": {
       "build": "next build",
       "start": "next start",
       "db:generate": "prisma generate",
       "db:push": "prisma db push",
       "db:migrate": "prisma migrate deploy",
       "db:seed": "tsx prisma/seed.ts"
     }
   }
   ```

### Step 2: Create Web Service

1. **Navigate to Render Dashboard**
   ```
   Dashboard → New → Web Service
   ```

2. **Connect GitHub Repository**
   ```
   Connect Repository: Ai-Whisperers/AI-Whisperers-website-and-courses
   Branch: main
   ```

3. **Configure Build Settings**
   ```
   Name: aiwhisperers-web
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Plan: Starter ($7/month) or higher
   ```

### Step 3: Environment Variables Configuration

Set the following environment variables in Render dashboard:

#### Required Variables

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:port/database
# Use the Internal Database URL from Step 1

# NextAuth Configuration
NEXTAUTH_SECRET=your-very-secure-random-secret-string-here
NEXTAUTH_URL=https://your-app-name.onrender.com

# Basic Security
NODE_ENV=production
```

#### OAuth Provider Variables

**Google OAuth:**
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**GitHub OAuth:**
```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### Optional Service Variables

**Email Service (ConvertKit example):**
```bash
CONVERTKIT_API_KEY=your-convertkit-api-key
EMAIL_FROM=noreply@yourdomain.com
```

**Payment Processing (PayPal example):**
```bash
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_ENVIRONMENT=production
```

**AI Services:**
```bash
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### Step 4: Deploy Application

1. **Trigger Initial Deploy**
   - Render will automatically deploy on repository connection
   - Monitor build logs for any issues

2. **Build Process Overview**
   ```bash
   # Render executes these commands:
   npm ci                    # Install dependencies
   npm run db:generate      # Generate Prisma client
   npm run build           # Build Next.js application
   npm start              # Start production server
   ```

3. **Monitor Deployment Status**
   - Check build logs for errors
   - Verify successful deployment
   - Note the assigned URL (e.g., `https://aiwhisperers-web.onrender.com`)

## 🔧 Post-Deployment Configuration

### Step 1: Database Migration and Seeding

1. **Access Render Shell** (if available) or use local connection:
   ```bash
   # Connect to production database locally
   export DATABASE_URL="your-external-database-url"
   
   # Run migrations
   npx prisma migrate deploy
   
   # Seed database with course content
   npm run db:seed
   ```

2. **Verify Database Setup**
   ```bash
   # Check if tables were created
   npx prisma studio
   # Open Prisma Studio to verify data
   ```

### Step 2: OAuth Provider Configuration

#### Google OAuth Setup

1. **Google Cloud Console**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project or select existing

2. **Enable Google+ API**
   ```
   APIs & Services → Library → Google+ API → Enable
   ```

3. **Create OAuth Credentials**
   ```
   APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs
   
   Application Type: Web application
   Name: AI Whisperers Production
   
   Authorized JavaScript origins:
   https://your-app-name.onrender.com
   
   Authorized redirect URIs:
   https://your-app-name.onrender.com/api/auth/callback/google
   ```

4. **Copy Client Credentials**
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Render environment variables

#### GitHub OAuth Setup

1. **GitHub Developer Settings**
   - Go to GitHub → Settings → Developer settings → OAuth Apps

2. **Create New OAuth App**
   ```
   Application name: AI Whisperers
   Homepage URL: https://your-app-name.onrender.com
   Authorization callback URL: 
   https://your-app-name.onrender.com/api/auth/callback/github
   ```

3. **Generate Client Secret**
   - Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to Render environment variables

### Step 3: Domain Configuration (Optional)

#### Custom Domain Setup

1. **Add Custom Domain in Render**
   ```
   Service Settings → Custom Domains → Add Custom Domain
   Domain: yourdomain.com
   ```

2. **Configure DNS**
   ```
   # Add CNAME record in your DNS provider:
   CNAME: www.yourdomain.com → your-app-name.onrender.com
   ```

3. **Update Environment Variables**
   ```bash
   NEXTAUTH_URL=https://yourdomain.com
   ```

4. **Update OAuth Providers**
   - Update callback URLs in Google Cloud Console
   - Update callback URLs in GitHub OAuth App settings

## 🔍 Monitoring and Maintenance

### Health Checks

Render automatically monitors your application. You can also implement custom health checks:

1. **Add Health Check Endpoint** (`src/app/api/health/route.ts`):
   ```typescript
   export async function GET() {
     try {
       // Check database connection
       await prisma.$queryRaw`SELECT 1`
       
       return Response.json({
         status: 'healthy',
         timestamp: new Date().toISOString(),
         services: {
           database: 'connected',
           authentication: 'active'
         }
       })
     } catch (error) {
       return Response.json(
         { status: 'unhealthy', error: error.message },
         { status: 500 }
       )
     }
   }
   ```

2. **Configure Health Check in Render**
   ```
   Service Settings → Health Check Path: /api/health
   ```

### Logging and Monitoring

1. **Application Logs**
   - Available in Render dashboard under "Logs"
   - Aggregated from all service instances

2. **Database Monitoring**
   - PostgreSQL metrics available in Render dashboard
   - Monitor connection count, query performance

3. **External Monitoring** (Optional)
   - Sentry for error tracking
   - Uptime monitoring services
   - Performance monitoring tools

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures

**Issue**: Dependencies not installing
```bash
# Solution: Clear npm cache and reinstall
npm ci --no-cache
```

**Issue**: Prisma client generation fails
```bash
# Solution: Ensure DATABASE_URL is set during build
# Add to build command: npm run db:generate
```

**Issue**: Next.js build errors
```bash
# Solution: Check for TypeScript errors locally
npm run build
npx tsc --noEmit
```

#### Runtime Issues

**Issue**: Database connection errors
```
Error: P1001: Can't reach database server
```

**Solution**: 
- Verify DATABASE_URL is correct
- Use Internal Database URL for Render services
- Check database service is running

**Issue**: NextAuth authentication errors
```
Error: NEXTAUTH_URL is not set
```

**Solution**:
- Set NEXTAUTH_URL to your Render service URL
- Ensure NEXTAUTH_SECRET is set to secure random string

**Issue**: OAuth provider errors
```
Error: OAuth callback mismatch
```

**Solution**:
- Verify OAuth callback URLs match your domain
- Update OAuth provider settings when domain changes

### Performance Optimization

#### Database Performance

1. **Connection Pooling**
   ```typescript
   // In production, use connection pooling
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL + '?connection_limit=5'
       }
     }
   })
   ```

2. **Query Optimization**
   - Use Prisma's `select` to limit returned fields
   - Implement proper pagination
   - Add database indexes for frequent queries

#### Application Performance

1. **Static Generation**
   ```typescript
   // Use ISR for course catalog pages
   export const revalidate = 3600 // Revalidate every hour
   ```

2. **Image Optimization**
   ```typescript
   // Use Next.js Image component
   import Image from 'next/image'
   ```

3. **Bundle Optimization**
   ```javascript
   // next.config.ts
   module.exports = {
     experimental: {
       optimizeCss: true,
       optimizeServerReact: true
     }
   }
   ```

## 📊 Scaling Considerations

### Horizontal Scaling

When traffic increases:

1. **Upgrade Render Plan**
   - Move from Starter to Professional
   - Enable autoscaling
   - Multiple instances for high availability

2. **Database Scaling**
   - Upgrade to higher PostgreSQL plan
   - Consider read replicas for heavy read workloads
   - Implement query optimization

3. **CDN Integration**
   - Render includes basic CDN
   - Consider Cloudflare for advanced features
   - Optimize static asset delivery

### Monitoring Scaling Needs

1. **Key Metrics**
   - Response times
   - Database query performance
   - Memory and CPU usage
   - Error rates

2. **Scaling Triggers**
   - Response time > 2 seconds
   - CPU usage > 80% sustained
   - Memory usage > 85%
   - Database connection pool exhaustion

## 🔐 Security Configuration

### Production Security Checklist

- [ ] **HTTPS Enabled**: Render provides automatic HTTPS
- [ ] **Environment Variables**: All secrets stored securely
- [ ] **Database Security**: PostgreSQL with authentication
- [ ] **CORS Configuration**: Properly configured for your domain
- [ ] **Rate Limiting**: Implement API rate limiting
- [ ] **Input Validation**: All inputs validated with Zod
- [ ] **SQL Injection Protection**: Using Prisma ORM
- [ ] **XSS Protection**: React's built-in protection

### Security Headers

Add security headers in `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  }
}
```

## 📈 Cost Optimization

### Render.com Pricing

**Web Service (Starter Plan - $7/month)**:
- 0.5 CPU, 512 MB RAM
- Automatic deployments
- Custom domains
- HTTPS certificates

**PostgreSQL (Starter Plan - $7/month)**:
- 1 GB RAM, 1 CPU
- 1 GB SSD storage
- Automated backups
- Connection pooling (paid plans)

**Total Minimum Cost**: ~$14/month for production deployment

### Cost Optimization Tips

1. **Right-size Resources**
   - Start with Starter plans
   - Monitor usage and upgrade as needed
   - Use autoscaling to handle traffic spikes

2. **Optimize Database Usage**
   - Implement query optimization
   - Use proper indexing
   - Clean up old data regularly

3. **Monitor Costs**
   - Review Render billing monthly
   - Set up usage alerts
   - Optimize for your usage patterns

---

*This deployment guide ensures a production-ready AI Whisperers platform on Render.com with proper security, monitoring, and scalability considerations. Follow the checklist to ensure all components are properly configured.*