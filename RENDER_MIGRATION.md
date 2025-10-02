# Render Service Migration Guide
## Node Runtime → Docker Runtime

**Date:** October 1, 2025
**Reason:** Fix static assets (CSS/JS/images) not loading due to Next.js standalone mode file structure
**Current Service:** `srv-d2sepmh5pdvs739cbl70` (Node runtime)
**New Service:** To be created (Docker runtime)

---

## 🔍 Root Cause Analysis

**Problem:** Styling and static assets return 404 errors (794-byte responses in logs)

**Why:**
1. Next.js standalone mode creates `.next/standalone/` directory
2. Standalone build **doesn't automatically copy** static files:
   - `.next/static/` (CSS, JS chunks)
   - `public/` (images, favicon, etc.)
3. Node runtime on Render only runs build → doesn't handle file copying
4. Docker runtime properly copies all required files (see Dockerfile lines 51-58)

---

## 📋 Migration Steps

### Step 1: Prepare Repository

**Already Done:**
- ✅ Updated `render.yaml` to use Docker runtime
- ✅ Updated `Dockerfile` to use dynamic PORT for Render
- ✅ `.dockerignore` optimized for build performance

**Commit Changes:**
```bash
git add render.yaml Dockerfile RENDER_MIGRATION.md
git commit -m "🐳 CONFIG: Switch to Docker runtime for proper static file serving"
git push origin main
```

### Step 2: Create New Web Service on Render

**Important:** You cannot change runtime from Node to Docker on existing service. Must create new service.

1. **Go to Render Dashboard**
   - URL: https://dashboard.render.com
   - Navigate to your project: "Projects"

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect to GitHub repository: `AI-Whisperers-website-and-courses`
   - Click "Connect"

3. **Configure Service Settings**

   | Setting | Value |
   |---------|-------|
   | **Name** | `ai-whisperers-web-v2` (or your preference) |
   | **Region** | `Oregon` (same as database) |
   | **Branch** | `main` |
   | **Root Directory** | (leave empty) |
   | **Runtime** | **Docker** ⚠️ |
   | **Dockerfile Path** | `./Dockerfile` |
   | **Docker Context** | `.` |
   | **Instance Type** | `Starter` (or match current plan) |

4. **Environment Variables**

   **Copy from Old Service:**
   - Go to old service `srv-d2sepmh5pdvs739cbl70` → Environment tab
   - Copy ALL environment variables to new service

   **Required Variables:**
   ```bash
   NODE_ENV=production
   NEXTAUTH_SECRET=[copy from old service]
   NEXTAUTH_URL=https://[new-service-name].onrender.com
   DATABASE_URL=[copy from old service - Internal URL]
   GOOGLE_CLIENT_ID=[copy from old service]
   GOOGLE_CLIENT_SECRET=[copy from old service]
   # ... copy all other variables
   ```

   **⚠️ Important:** Update `NEXTAUTH_URL` to match new service URL

5. **Advanced Settings**
   - **Auto-Deploy:** `Yes`
   - **Health Check Path:** `/api/health`
   - **Docker Command:** (leave empty - uses Dockerfile CMD)

6. **Create Service**
   - Click "Create Web Service"
   - Build will start automatically (takes 8-12 minutes for Docker)

### Step 3: Monitor Deployment

**Watch Build Logs:**
```
Expected output sequence:
✅ Step 1/16: FROM node:22.16.0-alpine AS deps
✅ Step 2/16: WORKDIR /app
...
✅ Step 13/16: COPY --from=builder /app/public ./public
✅ Step 14/16: COPY --from=builder /app/.next/standalone ./
✅ Step 15/16: COPY --from=builder /app/.next/static ./.next/static
...
✅ Build complete
✅ Deploying...
✅ Service is live
```

**Verify in Logs:**
```
==> Detected service running on port 10000
==> Health check passed
```

### Step 4: Verify Static Assets Load

1. **Open New Service URL**
   - https://[new-service-name].onrender.com

2. **Check Browser Console** (F12 → Console)
   - ✅ No 404 errors for CSS files
   - ✅ No 404 errors for JS files
   - ✅ No 404 errors for images
   - ✅ Styles render correctly

3. **Check Network Tab** (F12 → Network)
   - Verify CSS files load (should be >794 bytes)
   - Verify JS chunks load properly
   - Verify images from `/public` load

4. **Test Functionality**
   - [ ] Homepage loads with proper styling
   - [ ] Navigation menu works
   - [ ] Images display correctly
   - [ ] Favicon appears
   - [ ] Theme selector works
   - [ ] Authentication flow works

### Step 5: Update OAuth Callbacks

**Google OAuth:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Edit OAuth 2.0 Client
3. Add new Authorized Redirect URI:
   - `https://[new-service-name].onrender.com/api/auth/callback/google`
4. Save changes

**GitHub OAuth (if used):**
1. Go to https://github.com/settings/developers
2. Edit OAuth App
3. Update Authorization callback URL:
   - `https://[new-service-name].onrender.com/api/auth/callback/github`
4. Save

**Test Authentication:**
- Visit new service → Click "Sign In"
- Verify OAuth flow completes successfully

### Step 6: Update Custom Domain (If Applicable)

**If using custom domain:**

1. **In New Service Settings:**
   - Go to "Settings" → "Custom Domains"
   - Add your domain: `aiwhisperers.com`

2. **Update DNS Records:**
   - Change CNAME to point to new service
   - Wait for DNS propagation (5-30 minutes)

3. **Update Environment Variables:**
   - Change `NEXTAUTH_URL` to custom domain
   - Redeploy if needed

4. **SSL Certificate:**
   - Render auto-provisions SSL (5-10 minutes)
   - Verify HTTPS works

### Step 7: Decommission Old Service

**⚠️ Wait 24-48 hours to ensure stability before deleting old service**

**After Verification:**
1. Test new service thoroughly for 24-48 hours
2. Monitor logs for any errors
3. Verify all functionality works

**Then Delete Old Service:**
1. Go to old service `srv-d2sepmh5pdvs739cbl70`
2. Settings → "Delete Service"
3. Confirm deletion
4. **Note:** This frees up one service slot on your plan

---

## 🔄 Rollback Plan

**If new Docker service has issues:**

**Option 1: Keep Both Running**
- Old service URL still works
- Switch DNS back to old service
- Investigate Docker issues

**Option 2: Quick Fix on Node Runtime**
- Add to old service build command:
  ```bash
  npm run build && cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
  ```
- Update start command:
  ```bash
  node .next/standalone/server.js
  ```
- Redeploy old service

---

## 📊 Expected Improvements

**Before (Node Runtime):**
- ❌ CSS files: 794 bytes (404 error)
- ❌ JS chunks: 794 bytes (404 error)
- ❌ Images: 794 bytes (404 error)
- ❌ No styling on homepage
- ❌ Broken UI components

**After (Docker Runtime):**
- ✅ CSS files: ~50KB+ (actual content)
- ✅ JS chunks: ~200KB+ (actual bundles)
- ✅ Images: Actual file sizes
- ✅ Full styling applied
- ✅ Working UI components

---

## 🐛 Troubleshooting

### Build Fails with "Cannot find Dockerfile"
```bash
# Solution: Verify Dockerfile is in repo root
ls -la Dockerfile

# Should exist at: ./Dockerfile
```

### Docker Build Exceeds Time Limit
```bash
# Solution: Build is taking too long (Node 22 Alpine is optimized)
# Check .dockerignore excludes node_modules
# May need to upgrade Render plan for faster builds
```

### Static Files Still 404
```bash
# Verify Dockerfile copy commands:
# Should have these lines:
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
```

### Health Check Failing
```bash
# Verify /api/health endpoint exists
# Check logs for port binding
# Should see: "Detected service running on port 10000"
```

### Database Connection Errors
```bash
# Verify DATABASE_URL copied correctly
# Should use Internal Database URL for Render services
# Format: postgresql://user:pass@hostname.oregon-postgres.render.com/db
```

---

## 📝 Checklist

**Pre-Migration:**
- [x] Update render.yaml to Docker runtime
- [x] Update Dockerfile for Render PORT compatibility
- [x] Commit and push changes
- [ ] Backup environment variables from old service

**During Migration:**
- [ ] Create new web service with Docker runtime
- [ ] Configure all environment variables
- [ ] Set NEXTAUTH_URL to new service URL
- [ ] Wait for build to complete (8-12 minutes)
- [ ] Monitor build logs for errors

**Post-Migration:**
- [ ] Verify static assets load (check browser console)
- [ ] Test styling renders correctly
- [ ] Update OAuth provider callback URLs
- [ ] Test authentication flow
- [ ] Update custom domain (if applicable)
- [ ] Monitor service for 24-48 hours
- [ ] Delete old service (after verification)

---

## 📞 Support Resources

**If You Get Stuck:**

1. **Render Documentation:**
   - Docker Services: https://render.com/docs/docker
   - Environment Variables: https://render.com/docs/environment-variables

2. **Next.js Documentation:**
   - Standalone Output: https://nextjs.org/docs/advanced-features/output-file-tracing
   - Docker Deployment: https://nextjs.org/docs/deployment#docker-image

3. **Project Files:**
   - Dockerfile: `./Dockerfile`
   - Render Config: `./render.yaml`
   - Deployment Guide: `./DEPLOYMENT.md`
   - Local Logs: `./local-reports/logs.md`

4. **Render Service IDs:**
   - Old Service (Node): `srv-d2sepmh5pdvs739cbl70`
   - Database: `dpg-d2sfso7diees738r970g-a`
   - New Service (Docker): (to be created)

---

**Migration Guide Version:** 1.0
**Created:** October 1, 2025
**Status:** Ready for execution

Good luck with the migration! 🚀
