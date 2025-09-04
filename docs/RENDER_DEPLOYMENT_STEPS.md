# Render.com Deployment Steps - AI Whisperers Platform

## 🚀 Complete Deployment Guide (Without CLI)

Since the Render CLI doesn't support Windows, here's the complete web dashboard deployment process.

### Phase 1: Database Setup (5 minutes)

#### Step 1: Create PostgreSQL Database

1. **Go to Render Dashboard**: [render.com/dashboard](https://render.com/dashboard)
2. **Create Database Service**:
   ```
   New → PostgreSQL
   ```

3. **Database Configuration**:
   ```
   Name: aiwhisperers-db
   Database Name: aiwhisperers
   User: aiwhisperers_user
   Region: Oregon (or closest to your users)
   PostgreSQL Version: 14
   Plan: Starter ($7/month)
   ```

4. **Save Database Configuration**
   - Click **Create Database**
   - Wait for provisioning (1-2 minutes)

5. **Copy Connection Details**:
   - **Internal Database URL**: `postgresql://user:pass@internal-host:5432/db`
   - **External Database URL**: `postgresql://user:pass@external-host:5432/db`

### Phase 2: Web Service Deployment (5 minutes)

#### Step 1: Create Web Service

1. **Create Web Service**:
   ```
   New → Web Service
   ```

2. **Connect GitHub Repository**:
   ```
   Repository: Ai-Whisperers/AI-Whisperers-website-and-courses
   Branch: main
   ```

3. **Service Configuration**:
   ```
   Name: aiwhisperers-web
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Health Check Path: /api/health
   Plan: Starter ($7/month)
   ```

#### Step 2: Environment Variables

Set these environment variables in the **Environment** tab:

**Required Variables**:
```bash
# Database (use Internal URL from database service)
DATABASE_URL=postgresql://aiwhisperers_user:password@internal-hostname:5432/aiwhisperers

# Authentication
NODE_ENV=production
NEXTAUTH_SECRET=your-generated-32-character-secret
NEXTAUTH_URL=https://your-app-name.onrender.com
```

**OAuth Variables** (add after getting credentials):
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### Step 3: Deploy

1. **Click "Create Web Service"**
2. **Monitor Build Logs** - Check for successful build
3. **Wait for Deployment** - Usually 3-5 minutes
4. **Get App URL** - `https://your-app-name.onrender.com`

### Phase 3: Database Population (2 minutes)

#### Step 1: Database Migration

Migrations run automatically via the `postbuild` script during deployment. If needed manually:

1. **Connect to Database** (use External URL for local connection):
   ```bash
   export DATABASE_URL="postgresql://user:pass@external-hostname:5432/db"
   ```

2. **Apply Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

#### Step 2: Seed Course Content

**Method 1: Local Seeding** (recommended):
```bash
# Set external database URL
export DATABASE_URL="your-external-database-url"

# Seed with $150K+ course content
npm run db:seed
```

**Method 2: Via Deployed App** (if Render Shell available):
```bash
# In Render Shell (if available)
npm run db:seed
```

#### Step 3: Verify Data

**Check via API**:
```bash
# Test course API
curl https://your-app-name.onrender.com/api/courses

# Should return 4 courses:
# - AI Foundations ($299)
# - Applied AI ($599)  
# - AI Web Development ($1,299)
# - Enterprise AI Business ($1,799)
```

**Check via Prisma Studio**:
```bash
# Local connection to production database
export DATABASE_URL="your-external-database-url"
npx prisma studio
```

## 🔧 OAuth Provider Setup

### Google OAuth Setup

1. **Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Create Project** or select existing
3. **Enable APIs**: Google+ API
4. **Create Credentials**:
   ```
   APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   
   Application Type: Web application
   Name: AI Whisperers Production
   
   Authorized JavaScript origins:
   https://your-app-name.onrender.com
   
   Authorized redirect URIs:
   https://your-app-name.onrender.com/api/auth/callback/google
   ```

### GitHub OAuth Setup

1. **GitHub Developer Settings**: [github.com/settings/developers](https://github.com/settings/developers)
2. **OAuth Apps** → **New OAuth App**:
   ```
   Application name: AI Whisperers
   Homepage URL: https://your-app-name.onrender.com
   Authorization callback URL: 
   https://your-app-name.onrender.com/api/auth/callback/github
   ```

## 🚨 Troubleshooting

### Build Issues

**Error**: `PrismaCourseRepository is not defined`
- **Cause**: Database connection not available during build
- **Solution**: Environment variables properly set

**Error**: `Migration failed`
- **Cause**: Database permissions or connection issue
- **Solution**: Check DATABASE_URL and database permissions

### Runtime Issues

**Error**: Database connection timeout
- **Cause**: Wrong database URL (External vs Internal)
- **Solution**: Use Internal URL for Render services

**Error**: No courses found
- **Cause**: Database not seeded
- **Solution**: Run `npm run db:seed`

## 📊 Verification Checklist

### ✅ Deployment Success Checklist:

- [ ] **Database Created**: PostgreSQL service running
- [ ] **Web Service Deployed**: Application built and started
- [ ] **Environment Variables Set**: All required variables configured
- [ ] **Database Connected**: Health check shows database connection
- [ ] **Migrations Applied**: Schema deployed to database
- [ ] **Data Seeded**: 4 courses populated with content
- [ ] **API Functional**: `/api/courses` returns real data
- [ ] **Authentication Working**: OAuth providers configured
- [ ] **Pages Loading**: `/courses` shows real course catalog

### 🎯 Final Verification:

1. **Health Check**: `https://your-app.onrender.com/api/health`
   - Should show `database: 'connected'`

2. **Course API**: `https://your-app.onrender.com/api/courses`
   - Should return 4 courses with full details

3. **Course Page**: `https://your-app.onrender.com/courses`
   - Should display course catalog with real data

4. **Individual Course**: `https://your-app.onrender.com/courses/ai-foundations`
   - Should show detailed course information

## 💰 Total Deployment Cost

- **PostgreSQL Database**: $7/month
- **Web Service**: $7/month
- **Total**: **$14/month**

**What You Get**: Production-ready AI education platform with $150,000+ worth of course content! 🎉

---

*Follow this guide step-by-step for a successful database-connected deployment to Render.com.*