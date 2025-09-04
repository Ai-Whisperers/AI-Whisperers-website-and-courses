# AI Whisperers - Deployment Guide (Node.js Only)

## 🚀 Deployment Overview (Updated)

This guide provides comprehensive instructions for deploying the AI Whisperers educational platform to **Render.com** using the new **Node.js-only architecture**. No database or external services are required.

### Deployment Architecture (Simplified)

```
┌─────────────────────────────────────────────────────────┐
│                    RENDER.COM DEPLOYMENT                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                  WEB SERVICE                        │ │
│  │                   (Node.js)                         │ │
│  │                                                     │ │
│  │ • Next.js Application (Standalone Mode)             │ │
│  │ • API Routes (/api/*)                              │ │
│  │ • Static Assets (Compiled Content)                  │ │
│  │ • JWT Authentication (No Database)                  │ │
│  │ • Health Check Endpoint (/api/health)               │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              EXTERNAL INTEGRATIONS                  │ │
│  │                   (Optional)                        │ │
│  │                                                     │ │
│  │ • OAuth Providers (Google, GitHub)                  │ │
│  │ • Email Service (Magic Link Authentication)         │ │
│  │ • AI Services (OpenAI, Anthropic) [Future]          │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Simplifications:**
- ✅ **No Database Required**: Eliminated PostgreSQL dependency
- ✅ **Single Service**: One web service handles everything
- ✅ **Self-contained**: All content bundled with application
- ✅ **Zero External Dependencies**: Works without external services

## 📋 Prerequisites (Minimal)

### Required Accounts
1. **GitHub Account**: For source code repository
2. **Render Account**: For cloud deployment platform

### Optional Accounts (For Full Functionality)
3. **Google Cloud Console**: For Google OAuth (optional)
4. **GitHub Developer Settings**: For GitHub OAuth (optional)

**Note**: The application works without any OAuth providers - users can still access all content and features.

### System Requirements
- **Git**: For repository access
- **Modern Browser**: For accessing deployed application
- **Environment Variables**: OAuth credentials (optional)

## 🚀 Quick Deployment (Render.com)

### Method 1: Blueprint Deployment (Recommended)

**One-Click Deploy**: Use our `render.yaml` blueprint for instant deployment.

1. **Fork Repository**:
   ```bash
   # Fork the repository on GitHub
   https://github.com/Ai-Whisperers/AI-Whisperers-website-and-courses/fork
   ```

2. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub account
   - Select your forked repository
   - Click "Deploy"

3. **Automatic Setup**: Render will automatically:
   - Create web service
   - Install Node.js dependencies
   - Run content compilation
   - Build Next.js application
   - Deploy to production URL

### Method 2: Manual Service Creation

1. **Create Web Service**:
   - Go to Render Dashboard → "New" → "Web Service"
   - Connect GitHub repository
   - Configure service:

```yaml
Service Configuration:
├── Name: ai-whisperers-web
├── Runtime: Node
├── Branch: main
├── Build Command: npm run build
├── Start Command: npm start
└── Instance Type: Starter ($7/month)
```

2. **Environment Variables** (Set in Render Dashboard):
```bash
# Required
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://your-app-name.onrender.com

# Optional OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id  
GITHUB_CLIENT_SECRET=your-github-client-secret
```

3. **Deploy**: Click "Deploy" to start deployment

## 🔧 Build Process Details

### Render Build Commands

**Build Command**: `npm run build`
```bash
# This command automatically:
1. npm install                    # Install dependencies
2. npm run prebuild              # Compile YAML content to TypeScript
3. next build                    # Build Next.js application with compiled content
```

**Start Command**: `npm start`
```bash
# This command (for standalone mode):
1. Starts standalone Next.js server (node .next/standalone/server.js)
2. Serves static assets and API routes with optimized performance
3. Handles authentication and content with minimal footprint
```

### Build Process Flow

```
1. Git Push → Trigger Render Build
2. Install Dependencies → npm install
3. Content Compilation → YAML → TypeScript modules  
4. Next.js Build → Static generation with compiled content
5. Docker Container → Standalone Next.js application
6. Health Check → /api/health endpoint verification
7. Live Deployment → Production URL available
```

### Build Environment

**Node.js Version**: Automatically detected from package.json engines
**Memory**: 4GB (sufficient for Next.js build)
**Build Time**: ~3-5 minutes typical
**Bundle Size**: Optimized standalone mode

## 🛠️ Environment Configuration

### Required Environment Variables

#### **NEXTAUTH_SECRET** (Required)
- **Purpose**: JWT token signing secret
- **Generation**: Use Render's "Generate Value" feature
- **Format**: 32+ character random string
- **Security**: Keep this secret and unique per environment

#### **NEXTAUTH_URL** (Required)
- **Purpose**: Base URL for NextAuth.js callbacks
- **Production**: `https://your-app-name.onrender.com`
- **Development**: `http://localhost:3000`
- **Auto-configuration**: Use Render's service URL feature

### Optional Environment Variables

#### **OAuth Providers** (For Authentication)

**Google OAuth**:
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- **Setup**: [Google OAuth Setup Guide](https://console.cloud.google.com)

**GitHub OAuth**:
- `GITHUB_CLIENT_ID`: From GitHub Developer Settings
- `GITHUB_CLIENT_SECRET`: From GitHub Developer Settings
- **Setup**: [GitHub OAuth Apps](https://github.com/settings/applications/new)

**Email Provider** (Magic Links):
- `EMAIL_SERVER_HOST`: SMTP server hostname
- `EMAIL_SERVER_PORT`: SMTP port (usually 587)
- `EMAIL_SERVER_USER`: SMTP username
- `EMAIL_SERVER_PASSWORD`: SMTP password
- `EMAIL_FROM`: From email address

### Environment Variable Setup in Render

1. **Navigate to Service**: Go to your service in Render Dashboard
2. **Environment Tab**: Click "Environment" in sidebar
3. **Add Variables**: Click "Add Environment Variable"
4. **Required Setup**:
   ```
   NEXTAUTH_SECRET → Generate Value
   NEXTAUTH_URL → Use Service URL
   ```
5. **Optional Setup**: Add OAuth credentials as needed

## 📊 Deployment Verification

### Health Check System

**Endpoint**: `https://your-app-name.onrender.com/api/health`

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-09-04T...",
  "services": {
    "application": "running",
    "api": "operational"
  },
  "version": "0.1.0",
  "environment": "production"
}
```

### Deployment Checklist

**Pre-deployment**:
- [ ] Content compilation works locally (`npm run compile-content`)
- [ ] Build completes successfully (`npm run build`)
- [ ] Environment variables configured
- [ ] OAuth providers setup (optional)

**Post-deployment**:
- [ ] Health check returns 200 status
- [ ] Homepage loads correctly
- [ ] Authentication system working (if configured)
- [ ] All content pages accessible
- [ ] No console errors in browser

### Performance Monitoring

**Render Metrics**: Available in Render Dashboard
- **Response Time**: Should be <500ms for most pages
- **Memory Usage**: Expected ~100-200MB
- **CPU Usage**: Low (stateless application)
- **Error Rate**: Should be <1%

## 🐛 Troubleshooting Deployment Issues

### Common Build Failures

#### **1. Content Compilation Errors**
```
Error: Failed to compile content
```
**Cause**: Invalid YAML syntax in content files
**Solution**: 
```bash
# Check YAML syntax locally
npm run compile-content
# Fix any YAML errors reported
```

#### **2. Environment Variable Missing**
```
Error: Missing required environment variable: NEXTAUTH_SECRET
```
**Solution**: Add missing environment variable in Render Dashboard

#### **3. Build Timeout**
```
Build exceeded time limit
```
**Cause**: Build taking too long
**Solution**: Check for infinite loops in build scripts, verify package.json scripts

### Common Runtime Issues

#### **1. Authentication Not Working**
**Cause**: Missing or incorrect environment variables
**Debugging**:
```bash
# Check environment variables in Render logs
# Verify OAuth provider configuration
# Test with minimal auth providers
```

#### **2. Content Not Loading**
**Cause**: Content compilation failed silently
**Solution**:
```bash
# Check build logs for content compilation output
# Verify compiled content files exist in deployed bundle
```

#### **3. Performance Issues**
**Cause**: Large bundle size or inefficient code
**Solution**:
```bash
# Enable bundle analysis
ANALYZE=true npm run build
# Optimize imports and dependencies
```

## 🔄 Deployment Workflow

### Development to Production

1. **Local Development**:
   ```bash
   git clone [repository]
   npm install
   npm run compile-content
   npm run dev
   ```

2. **Content Updates**:
   ```bash
   # Edit content files
   vim src/content/pages/homepage.yml
   
   # Test compilation
   npm run compile-content
   
   # Test build
   npm run build
   ```

3. **Deployment**:
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   # Automatic deployment triggered on Render
   ```

4. **Verification**:
   - Check deployment status in Render Dashboard
   - Verify health check endpoint
   - Test application functionality

### Rollback Procedure

**If Deployment Fails**:
1. **Check Render Logs**: Identify specific failure point
2. **Local Testing**: Reproduce issue locally if possible
3. **Rollback**: Revert to previous working commit
   ```bash
   git revert HEAD
   git push origin main
   ```
4. **Fix and Redeploy**: Address issue and redeploy

### Multi-Environment Setup (Optional)

**Preview Deployments**: Render automatically creates preview deployments for pull requests
**Production Branch**: main branch deploys to production
**Development Branch**: Can be configured for staging deployment

## 💰 Deployment Costs (Render.com)

### Service Costs
- **Web Service**: $7/month (Starter plan)
- **Bandwidth**: 100GB included
- **Build Minutes**: 500 minutes/month included
- **SSL Certificate**: Free (automatic HTTPS)

### Cost Optimizations
- **No Database Costs**: $0/month (eliminated)
- **Single Service**: Minimal infrastructure overhead
- **Efficient Bundle**: Standalone mode reduces resource usage
- **Static Assets**: Optimized for fast delivery

**Total Monthly Cost**: ~$7/month for production deployment

## 🔒 Security Considerations

### Deployment Security

1. **Environment Variables**: Never commit secrets to repository
2. **HTTPS Only**: Automatic SSL certificate from Render
3. **Security Headers**: Configured in next.config.ts
4. **Content Security Policy**: XSS protection enabled
5. **OAuth Security**: Secure OAuth provider configuration

### Security Checklist

**Pre-deployment**:
- [ ] No secrets in repository (.env not committed)
- [ ] Environment variables configured securely
- [ ] OAuth redirect URLs match deployment URL
- [ ] Security headers configured

**Post-deployment**:
- [ ] HTTPS working correctly
- [ ] No security warnings in browser console  
- [ ] Authentication working securely
- [ ] No sensitive data in error messages

---

## 📚 Additional Resources

### Render.com Resources
- [Render Documentation](https://render.com/docs)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables)

### Next.js Deployment Resources  
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Standalone Mode](https://nextjs.org/docs/advanced-features/output-file-tracing)

### OAuth Setup Guides
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Setup](https://docs.github.com/en/developers/apps/building-oauth-apps)

*This deployment guide accurately reflects the current Node.js-only architecture as of September 4, 2025, after removal of database dependencies and implementation of build-time content compilation.*