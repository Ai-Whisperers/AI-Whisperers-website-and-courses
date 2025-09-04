# Render.com Blueprint Deployment Guide

## 🚀 One-Click Deployment with Blueprint

The AI Whisperers platform includes a `render.yaml` blueprint file for automated deployment on Render.com. This blueprint automatically provisions both the web service and PostgreSQL database.

### What is a Blueprint?

A Render Blueprint is a YAML file that describes your application's infrastructure as code. It automates the deployment process by:
- Creating all required services (web service + database)
- Configuring environment variables
- Setting up service connections
- Defining resource specifications

## 📋 Blueprint Deployment Steps

### Step 1: Fork Repository

1. Fork this repository to your GitHub account
2. Ensure the `render.yaml` file is in the root directory

### Step 2: Deploy Blueprint

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in to your account

2. **Create New Blueprint**
   ```
   Dashboard → New → Blueprint
   ```

3. **Connect Repository**
   - Select your forked repository
   - Branch: `main`
   - Blueprint file: `render.yaml` (auto-detected)

4. **Review Configuration**
   - Service name: `ai-whisperers-web`
   - Database name: `ai-whisperers-db`
   - Plan: Starter ($7/month each)

5. **Deploy**
   - Click "Apply"
   - Wait for deployment to complete

### Step 3: Configure Environment Variables

The blueprint automatically sets up basic variables. Add OAuth credentials manually:

```bash
# Required for authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Step 4: Database Migration and Seeding

After deployment, the database schema is automatically applied via the `postbuild` script. To seed with course content:

1. **Access Render Shell** (if available) or use local connection
2. **Set environment variable**:
   ```bash
   export DATABASE_URL="your-render-database-url"
   ```
3. **Seed database**:
   ```bash
   npm run db:seed
   ```

## 🔧 Blueprint Configuration

### render.yaml Overview

```yaml
services:
  - type: web
    name: ai-whisperers-web
    runtime: node
    plan: starter
    buildCommand: npm ci && npm run build
    startCommand: npm start
    healthCheckPath: /api/health
    
databases:
  - name: ai-whisperers-db
    databaseName: aiwhisperers
    user: aiwhisperers_user
    plan: starter
```

### Automatic Environment Variables

The blueprint automatically configures:
- `NODE_ENV=production`
- `NEXTAUTH_SECRET` (auto-generated)
- `NEXTAUTH_URL` (from web service URL)
- `DATABASE_URL` (from database connection)

## 🔍 Troubleshooting Blueprint Deployment

### Common Issues

#### Build Failures
- **Issue**: Dependencies not installing
- **Solution**: The blueprint uses `npm ci` for deterministic builds

#### Database Connection
- **Issue**: Cannot connect to database
- **Solution**: Blueprint automatically configures `DATABASE_URL`

#### Environment Variables
- **Issue**: Missing OAuth variables
- **Solution**: Add OAuth credentials manually after blueprint deployment

### Verification Steps

1. **Check Service Status**
   - Both services should show "Deploy succeeded"
   - Web service should be accessible at provided URL

2. **Verify Database**
   - Database should be running
   - Connection string available in environment variables

3. **Test Health Check**
   - Visit `https://your-app.onrender.com/api/health`
   - Should return healthy status

## 🌟 Benefits of Blueprint Deployment

### Automation
- **Single Command**: Deploy entire infrastructure
- **Consistent Setup**: Same configuration every time
- **Service Linking**: Automatic service connections

### Best Practices
- **Infrastructure as Code**: Version-controlled deployment
- **Environment Separation**: Production-ready configuration
- **Security**: Auto-generated secrets

### Cost Efficiency
- **Predictable Costs**: Starter plans for both services
- **Resource Optimization**: Right-sized for typical workloads
- **Scaling Ready**: Easy plan upgrades when needed

## 🔄 Blueprint Updates

### Modifying the Blueprint

1. **Update render.yaml**:
   ```yaml
   # Example: Change plan size
   services:
     - type: web
       plan: standard  # Upgraded from starter
   ```

2. **Redeploy Blueprint**:
   - Push changes to GitHub
   - Render detects changes and updates services

### Environment-Specific Configurations

```yaml
# Development environment
envVars:
  - key: LOG_LEVEL
    value: debug
    
# Production environment (default)
envVars:
  - key: LOG_LEVEL
    value: info
```

## 🚀 Production Readiness Checklist

### Before Deploying
- [ ] OAuth providers configured (Google, GitHub)
- [ ] Environment secrets prepared
- [ ] Domain name ready (optional)
- [ ] Monitoring tools setup (optional)

### After Deployment
- [ ] Health check endpoint responding
- [ ] Database connection working
- [ ] Authentication flow tested
- [ ] Course content seeded
- [ ] Performance monitoring active

## 📊 Cost Breakdown

### Blueprint Deployment Costs

| Service | Plan | Monthly Cost | Resources |
|---------|------|--------------|-----------|
| Web Service | Starter | $7/month | 0.5 CPU, 512 MB RAM |
| PostgreSQL | Starter | $7/month | 1 GB RAM, 1 GB SSD |
| **Total** | | **$14/month** | Full production setup |

### Cost Optimization Tips

1. **Start Small**: Use Starter plans initially
2. **Monitor Usage**: Upgrade when needed
3. **Optimize Queries**: Reduce database load
4. **Cache Static Content**: Minimize server requests

## 🔗 Additional Resources

- [Render Blueprint Documentation](https://render.com/docs/blueprint-spec)
- [Environment Variables Guide](https://render.com/docs/environment-variables)
- [Database Management](https://render.com/docs/databases)
- [Custom Domains](https://render.com/docs/custom-domains)

---

*This blueprint deployment approach provides the fastest path to production for the AI Whisperers platform, with enterprise-ready configuration and automatic service provisioning.*