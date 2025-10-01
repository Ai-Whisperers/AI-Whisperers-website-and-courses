# Deployment Guide - AI Whisperers Platform
**Complete deployment instructions for Render.com**

**Last Updated:** October 1, 2025
**Platform Version:** Next.js 15.5.2
**Database:** PostgreSQL (Render PostgreSQL)
**Node Version:** 20.x

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Render PostgreSQL Setup](#render-postgresql-setup)
4. [Render Web Service Deployment](#render-web-service-deployment)
5. [Post-Deployment Steps](#post-deployment-steps)
6. [Verification & Testing](#verification--testing)
7. [Troubleshooting](#troubleshooting)
8. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Accounts & Services

1. **Render Account** - https://render.com
2. **GitHub Repository** - Connected to Render
3. **OAuth Provider Credentials** (at least one):
   - Google OAuth: https://console.cloud.google.com
   - GitHub OAuth: https://github.com/settings/developers
4. **PostgreSQL Database** - Render PostgreSQL service
5. **Domain Name** (optional but recommended)

### Required CLI Tools (Local Development)

```bash
# Node.js 20.x or higher
node --version  # Should be >= 20.0.0

# npm (comes with Node.js)
npm --version

# Prisma CLI (installed via npm)
npx prisma --version
```

---

## Environment Variables

### 🔐 Critical - Authentication & Security

#### `NEXTAUTH_SECRET` (REQUIRED)
- **Description:** Secret key for NextAuth.js session encryption
- **How to Generate:**
  ```bash
  openssl rand -base64 32
  ```
- **Example:** `your-32-character-random-string-here`
- **Security:** NEVER commit to git, rotate regularly

#### `NEXTAUTH_URL` (REQUIRED)
- **Description:** Public URL of your application
- **Development:** `http://localhost:3000`
- **Production:** `https://your-domain.com` or `https://your-app.onrender.com`
- **Important:** Must match Render service URL exactly

#### `DATABASE_URL` (REQUIRED)
- **Description:** PostgreSQL connection string (Render provides this)
- **Format:** `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
- **Render Format:** `postgresql://username:password@hostname.oregon-postgres.render.com/database_name`
- **Source:** Copy from Render PostgreSQL service "Internal Database URL" or "External Database URL"
- **Important:** Use **External URL** for development, **Internal URL** for production (Render services)

---

### 🔑 OAuth Providers (At least ONE required)

#### Google OAuth (Recommended)

**Setup Instructions:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`

**Environment Variables:**
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret

#### GitHub OAuth (Alternative)

**Setup Instructions:**
1. Go to https://github.com/settings/developers
2. Create OAuth App
3. Add callback URL:
   - Development: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://your-domain.com/api/auth/callback/github`

**Environment Variables:**
- `GITHUB_CLIENT_ID`: Your GitHub OAuth Client ID
- `GITHUB_CLIENT_SECRET`: Your GitHub OAuth Client Secret

---

### 💳 Payment Processing (Optional - Future Enhancement)

#### PayPal
- `PAYPAL_CLIENT_ID`: PayPal application client ID
- `PAYPAL_CLIENT_SECRET`: PayPal application secret
- **Note:** Not currently integrated, reserved for future payment features

---

### 📧 Email Services (Optional)

#### ConvertKit (Marketing Emails)
- `CONVERTKIT_API_KEY`: ConvertKit API key for newsletter management
- **Use Case:** Newsletter signups, email campaigns

#### Resend (Transactional Emails)
- `RESEND_API_KEY`: Resend API key for transactional emails
- **Use Case:** User notifications, system emails

---

### 🤖 AI Services (Optional)

#### OpenAI
- `OPENAI_API_KEY`: OpenAI API key
- **Use Case:** Course content generation, AI features

#### Anthropic (Claude)
- `ANTHROPIC_API_KEY`: Anthropic API key
- **Use Case:** AI-powered course assistance

---

### ☁️ File Storage (Optional)

#### AWS S3
- `AWS_S3_BUCKET`: S3 bucket name for file uploads
- `AWS_ACCESS_KEY_ID`: AWS IAM access key
- `AWS_SECRET_ACCESS_KEY`: AWS IAM secret key
- **Use Case:** Course videos, user uploads, certificates

---

### 📊 Analytics (Optional)

#### Google Analytics
- `GOOGLE_ANALYTICS_ID`: GA4 Measurement ID (format: `G-XXXXXXXXXX`)
- **Use Case:** User behavior tracking, conversion analytics

---

## Render PostgreSQL Setup

### Step 1: Create PostgreSQL Database

1. **Navigate to Render Dashboard**
   - Go to https://dashboard.render.com
   - Click "New +" → "PostgreSQL"

2. **Configure Database**
   - **Name:** `aiwhisperers-production` (or your preferred name)
   - **Database:** `aiwhisperers_production`
   - **User:** `aiwhisperers_admin` (auto-generated)
   - **Region:** Oregon (us-west) - recommended
   - **PostgreSQL Version:** 16 (latest)
   - **Plan:** Choose based on needs:
     - **Starter ($7/mo):** 256 MB RAM, 1 GB Storage - Suitable for development
     - **Basic ($25/mo):** 1 GB RAM, 10 GB Storage - Recommended for production
     - **Standard ($85/mo):** 4 GB RAM, 50 GB Storage - For scale

3. **Create Database**
   - Click "Create Database"
   - Wait 2-3 minutes for provisioning

4. **Copy Connection Details**
   After creation, copy these values:
   - **Internal Database URL:** Use for Render services
   - **External Database URL:** Use for local development
   - **Host:** `dpg-xxxxx-a.oregon-postgres.render.com`
   - **Port:** `5432`
   - **Database Name:** `aiwhisperers_production`
   - **Username:** Auto-generated
   - **Password:** Auto-generated

### Step 2: Run Database Migrations

**Option A: From Local Machine (Recommended for first deployment)**

```bash
# Set DATABASE_URL to External URL
export DATABASE_URL="postgresql://user:password@host.oregon-postgres.render.com/database"

# Run Prisma migrations
npx prisma migrate deploy

# Verify migration
npx prisma db pull --print
```

**Option B: From Render Shell (Alternative)**

1. Go to Render Web Service dashboard
2. Click "Shell" tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

### Step 3: Verify Database Schema

Expected tables (19 total):
- `accounts` - NextAuth account linking
- `sessions` - User sessions
- `users` - User accounts
- `verification_tokens` - Email verification
- `courses` - Course catalog
- `course_modules` - Course structure
- `lessons` - Lesson content
- `enrollments` - Student enrollments
- `course_progress` - Progress tracking
- `lesson_progress` - Lesson completion
- `transactions` - Payment records
- `course_analytics` - Analytics data
- `media` - File storage metadata
- `quizzes` - Assessment quizzes
- `questions` - Quiz questions
- `quiz_attempts` - Student attempts
- `certificates` - Course certificates

---

## Render Web Service Deployment

### Step 1: Create Web Service

1. **Navigate to Render Dashboard**
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Select your GitHub account
   - Choose repository: `AI-Whisperers-website-and-courses`
   - Click "Connect"

3. **Configure Service**

   **Basic Settings:**
   - **Name:** `aiwhisperers-platform` (or your preferred name)
   - **Region:** Oregon (us-west) - same as database
   - **Branch:** `main`
   - **Root Directory:** Leave empty (uses repo root)

   **Build Settings:**
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm install && node scripts/compile-content.js && npx prisma generate && next build
     ```
   - **Start Command:**
     ```bash
     npm run start
     ```

   **Instance Settings:**
   - **Plan:** Choose based on needs:
     - **Free:** Limited (good for testing only)
     - **Starter ($7/mo):** 512 MB RAM - Suitable for MVP
     - **Basic ($25/mo):** 2 GB RAM - **Recommended for production**
     - **Standard ($85/mo):** 4 GB RAM - For high traffic

4. **Advanced Settings**
   - **Node Version:** `20` (Render uses nvm)
   - **Health Check Path:** `/` (default)
   - **Auto-Deploy:** `Yes` (deploy on git push)

### Step 2: Configure Environment Variables

In Render dashboard → Environment tab, add all variables:

**Critical Variables (MUST be set before first deploy):**

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Sets production mode |
| `NEXTAUTH_SECRET` | `[Generate with openssl]` | 32+ char random string |
| `NEXTAUTH_URL` | `https://your-app.onrender.com` | Your Render URL |
| `DATABASE_URL` | `[Copy from PostgreSQL service]` | Use **Internal URL** |
| `GOOGLE_CLIENT_ID` | `[Your Google OAuth ID]` | From Google Console |
| `GOOGLE_CLIENT_SECRET` | `[Your Google OAuth Secret]` | From Google Console |

**Optional Variables (can be added later):**

| Variable | Value | Notes |
|----------|-------|-------|
| `GITHUB_CLIENT_ID` | `[Your GitHub OAuth ID]` | Alternative auth |
| `GITHUB_CLIENT_SECRET` | `[Your GitHub OAuth Secret]` | Alternative auth |
| `GOOGLE_ANALYTICS_ID` | `G-XXXXXXXXXX` | Analytics tracking |
| `OPENAI_API_KEY` | `sk-...` | AI features |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | AI features |
| `CONVERTKIT_API_KEY` | `...` | Email marketing |
| `RESEND_API_KEY` | `re_...` | Transactional emails |

### Step 3: Deploy

1. **Click "Create Web Service"**
   - Render will start building immediately
   - Build takes 5-10 minutes for first deployment

2. **Monitor Build Logs**
   - Go to "Logs" tab
   - Watch for:
     ```
     ✅ Compiled content
     ✅ Prisma Client generated
     ✅ Next.js build successful
     ✅ Starting server...
     ```

3. **Wait for Live Status**
   - Service status changes from "Building" → "Live"
   - Green indicator appears

---

## Post-Deployment Steps

### 1. Verify Database Connection

```bash
# From Render Shell or local with DATABASE_URL set
npx prisma db pull --print

# Should show all 19 tables
```

### 2. Test Authentication Flow

1. Visit `https://your-app.onrender.com`
2. Click "Sign In" (or navigate to `/api/auth/signin`)
3. Test Google OAuth (or GitHub OAuth)
4. Verify successful login and redirect
5. Check Render logs for any errors

### 3. Verify Prisma Client Generation

Check build logs for:
```
✔ Generated Prisma Client (v6.16.3) to ./src/generated/prisma
```

If missing, rebuild:
```bash
npx prisma generate
```

### 4. Set Up Custom Domain (Optional)

1. **In Render Dashboard:**
   - Go to "Settings" tab
   - Scroll to "Custom Domains"
   - Click "Add Custom Domain"
   - Enter your domain: `aiwhisperers.com`

2. **Configure DNS:**
   - Add CNAME record:
     - **Name:** `@` or `www`
     - **Value:** `your-app.onrender.com`
   - Wait for DNS propagation (5-30 minutes)

3. **Update Environment Variables:**
   - Change `NEXTAUTH_URL` to `https://aiwhisperers.com`
   - Update OAuth callback URLs in Google/GitHub consoles

4. **Redeploy:**
   - Render will auto-deploy on env var change
   - Or manually trigger: "Manual Deploy" → "Deploy latest commit"

### 5. Enable HTTPS (Automatic)

- Render automatically provisions SSL certificates via Let's Encrypt
- Happens within 5-10 minutes of custom domain setup
- Verify at: `https://your-domain.com`

### 6. Set Up Monitoring (Recommended)

**Render Built-in Monitoring:**
- Go to "Metrics" tab
- Monitor: CPU, Memory, Request Rate, Response Time

**External Monitoring (Optional):**
- UptimeRobot: https://uptimerobot.com (free)
- Sentry: https://sentry.io (error tracking)
- LogRocket: https://logrocket.com (session replay)

---

## Verification & Testing

### Health Check Endpoints

1. **Homepage:** `https://your-app.onrender.com/`
   - Should load without errors
   - Check browser console for issues

2. **Authentication:** `https://your-app.onrender.com/api/auth/signin`
   - Should show OAuth providers
   - Test sign-in flow

3. **Database Status:** Check Render logs for:
   ```
   [Prisma] Query: SELECT * FROM "users" LIMIT 1
   ✅ Database connected
   ```

### Browser Console Checks

Open Developer Tools → Console, verify:
- ✅ No CORS errors
- ✅ No 404 errors for static assets
- ✅ No authentication errors
- ✅ Theme selector works (bottom right)

### Functional Testing Checklist

- [ ] Homepage loads with all sections
- [ ] Navigation menu works
- [ ] Sign in with Google OAuth
- [ ] User session persists after page refresh
- [ ] Theme selector changes colors
- [ ] Mobile responsive design works
- [ ] All images/assets load correctly
- [ ] No console errors or warnings

---

## Troubleshooting

### Build Failures

**Error:** `Cannot find module 'next'`
```bash
# Solution: Clear build cache
# In Render dashboard: "Manual Deploy" → "Clear build cache & deploy"
```

**Error:** `Prisma Client not generated`
```bash
# Solution: Add to build command
npm install && npx prisma generate && node scripts/compile-content.js && next build
```

**Error:** `ENOENT: no such file or directory, scandir`
```bash
# Solution: Ensure content compilation runs before build
# Build command should include: node scripts/compile-content.js
```

### Runtime Errors

**Error:** `[next-auth][error][CLIENT_FETCH_ERROR]`
```bash
# Solution: Check environment variables
# 1. Verify NEXTAUTH_URL matches your domain
# 2. Verify NEXTAUTH_SECRET is set
# 3. Check database connection (DATABASE_URL)
```

**Error:** `PrismaClientInitializationError`
```bash
# Solution: Database connection issue
# 1. Verify DATABASE_URL is correct (use Internal URL for Render)
# 2. Check PostgreSQL service is running
# 3. Verify Prisma migrations ran: npx prisma migrate deploy
```

**Error:** `Cannot read properties of undefined (reading 'call')`
```bash
# Solution: Prisma Client not properly initialized
# 1. Check src/lib/db/prisma.ts exists
# 2. Rebuild: npm run build
# 3. Restart service
```

### Database Issues

**Error:** `P1001: Can't reach database server`
```bash
# Solution: Connection string issue
# 1. For Render services: Use Internal Database URL
# 2. For local dev: Use External Database URL
# 3. Verify PostgreSQL service is running
# 4. Check firewall rules if using external URL
```

**Error:** `P3009: No migration found in prisma/migrations`
```bash
# Solution: Run migrations
npx prisma migrate deploy

# Or reset and migrate (WARNING: loses data)
npx prisma migrate reset --skip-seed
```

### Authentication Issues

**Error:** `redirect_uri_mismatch`
```bash
# Solution: OAuth callback URL mismatch
# In Google/GitHub OAuth console, add:
https://your-actual-domain.com/api/auth/callback/google
https://your-actual-domain.com/api/auth/callback/github

# Ensure NEXTAUTH_URL matches
```

**Error:** `adapter_error session_token`
```bash
# Solution: Session adapter issue
# 1. Verify sessions table exists: npx prisma db pull
# 2. Check src/lib/auth/config.ts has PrismaAdapter configured
# 3. Restart service
```

### Performance Issues

**Slow Response Times:**
```bash
# 1. Upgrade Render plan (more RAM/CPU)
# 2. Enable database connection pooling
# 3. Add caching layer (Redis)
# 4. Optimize images (use Next.js Image component)
```

**High Memory Usage:**
```bash
# 1. Check for memory leaks in logs
# 2. Ensure Prisma client is singleton (src/lib/db/prisma.ts)
# 3. Monitor with: Render → Metrics tab
# 4. Consider upgrading plan
```

---

## Rollback Procedures

### Emergency Rollback to Previous Version

**Option 1: Rollback via Render Dashboard**

1. Go to Render dashboard → "Deploys" tab
2. Find last working deployment (green checkmark)
3. Click three dots → "Rollback to this version"
4. Confirm rollback
5. Wait 2-3 minutes for redeployment

**Option 2: Git Revert**

```bash
# Find last working commit
git log --oneline

# Revert to specific commit
git revert <commit-hash>

# Push to trigger auto-deploy
git push origin main
```

**Option 3: Manual Deploy from Branch**

1. In Render dashboard → "Manual Deploy"
2. Select branch or commit
3. Click "Deploy"

### Database Rollback (USE WITH CAUTION)

**Warning:** Database rollbacks can cause data loss. Always backup first.

```bash
# Backup database first
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Rollback migration
npx prisma migrate resolve --rolled-back <migration_name>

# Apply previous migration
npx prisma migrate deploy
```

---

## Production Checklist

Before going live, ensure:

### Security
- [ ] `NEXTAUTH_SECRET` is strong (32+ characters)
- [ ] OAuth credentials are production (not dev/test)
- [ ] DATABASE_URL uses Internal URL (not External)
- [ ] All API keys are production versions
- [ ] HTTPS is enabled (automatic with Render)
- [ ] Environment variables are not exposed in client code

### Performance
- [ ] Database has appropriate plan (Basic or higher)
- [ ] Web service has adequate RAM (2GB+ recommended)
- [ ] Images are optimized (WebP format)
- [ ] Content is compiled before build
- [ ] Prisma Client is singleton pattern

### Monitoring
- [ ] Render metrics enabled
- [ ] Error tracking set up (optional: Sentry)
- [ ] Uptime monitoring configured (optional: UptimeRobot)
- [ ] Database backup schedule (Render automatic)

### Functionality
- [ ] All environment variables set correctly
- [ ] OAuth sign-in works (Google/GitHub)
- [ ] Database migrations applied
- [ ] Homepage loads without errors
- [ ] Mobile responsive design works
- [ ] All links/navigation functional

### Documentation
- [ ] Environment variables documented
- [ ] Deployment procedures documented
- [ ] Rollback procedures tested
- [ ] Team has access to Render dashboard

---

## Support & Resources

### Render Documentation
- Web Services: https://render.com/docs/web-services
- PostgreSQL: https://render.com/docs/databases
- Environment Variables: https://render.com/docs/environment-variables
- Deploy Hooks: https://render.com/docs/deploy-hooks

### Project Resources
- GitHub Repository: https://github.com/Ai-Whisperers/AI-Whisperers-website-and-courses
- Local Reports: `local-reports/` (deployment documentation)
- Docker Guide: `DOCKER.md` (local development)
- Architecture: http://localhost:3000/architecture (development only)

### Next.js Documentation
- Deployment: https://nextjs.org/docs/deployment
- Environment Variables: https://nextjs.org/docs/basic-features/environment-variables
- Standalone Mode: https://nextjs.org/docs/advanced-features/output-file-tracing

### Prisma Documentation
- Migrations: https://www.prisma.io/docs/concepts/components/prisma-migrate
- Production Best Practices: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management

### NextAuth.js Documentation
- Deployment: https://next-auth.js.org/deployment
- Prisma Adapter: https://next-auth.js.org/adapters/prisma
- OAuth Providers: https://next-auth.js.org/configuration/providers/oauth

---

## Deployment History

### Version 1.0.0 - October 1, 2025
- ✅ Initial production deployment
- ✅ Complete LMS database schema (19 tables)
- ✅ NextAuth with database sessions
- ✅ Google OAuth integration
- ✅ Docker configuration
- ✅ Prisma singleton pattern
- ✅ Homepage content structure
- ✅ Theme selector functionality
- ✅ Error handling and logging

### Migration Summary
- Previous database (trading system) backed up to `local-reports/migration/`
- Clean migration to LMS schema
- Zero data loss (only 1 config record existed)

---

## Quick Start Commands

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Test database connection
npx prisma db pull

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Build locally (test before deploy)
npm run build

# Start production server locally
npm run start

# View database in browser
npx prisma studio
```

---

**Deployment Guide Version:** 1.0.0
**Last Reviewed:** October 1, 2025
**Next Review:** November 1, 2025

For questions or issues, refer to troubleshooting section or create a GitHub issue.
