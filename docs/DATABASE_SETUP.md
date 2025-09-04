# Database Configuration Guide

## 🗄️ Render.com PostgreSQL Setup

### Step 1: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**: [render.com/dashboard](https://render.com/dashboard)
2. **Create Database**:
   ```
   New → PostgreSQL
   ```
3. **Configuration**:
   ```
   Name: aiwhisperers-db
   Database: aiwhisperers
   User: aiwhisperers_user
   Region: Oregon (closest to your users)
   PostgreSQL Version: 14
   Plan: Starter ($7/month)
   ```

### Step 2: Get Database Connection Details

After creation, Render provides:
- **Internal Database URL** (use for web services)
- **External Database URL** (use for local development)
- **Connection Parameters** (host, port, database, username, password)

**Example URLs**:
```bash
# Internal (for Render web services)
DATABASE_URL="postgresql://aiwhisperers_user:password@hostname:5432/aiwhisperers"

# External (for local development)  
DATABASE_URL="postgresql://aiwhisperers_user:password@external-hostname:5432/aiwhisperers"
```

### Step 3: Environment Variables Configuration

#### For Render.com Deployment:
Set in Render Dashboard → Web Service → Environment:
```bash
DATABASE_URL=<internal-database-url-from-render>
NODE_ENV=production
NEXTAUTH_SECRET=<generate-32-char-random-string>
NEXTAUTH_URL=https://your-app-name.onrender.com
```

#### For Local Development:
Update your `.env` file:
```bash
DATABASE_URL="<external-database-url-from-render>"
NODE_ENV=development
NEXTAUTH_SECRET="your-local-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 🔧 Database Schema & Migrations

### Step 4: Run Database Migrations

The schema is automatically applied during deployment via the `postbuild` script:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postbuild": "prisma migrate deploy"
  }
}
```

**Manual Migration** (if needed):
```bash
# Generate Prisma client
npx prisma generate

# Deploy migrations to database
npx prisma migrate deploy

# View database in browser
npx prisma studio
```

### Step 5: Seed Database with Course Content

**Production Seeding** (after deployment):
```bash
# Set environment variable
export DATABASE_URL="your-render-database-url"

# Run seeding script
npm run db:seed
```

**Local Seeding**:
```bash
npm run db:seed
```

## 📋 Database Schema Overview

### Core Tables:
- **users** - User accounts and authentication
- **courses** - Course information and content
- **modules** - Course modules/sections  
- **lessons** - Individual lesson content
- **enrollments** - Student course enrollments
- **user_progress** - Learning progress tracking
- **certificates** - Course completion certificates
- **payments** - Payment transactions
- **course_reviews** - Course ratings and reviews

### Authentication Tables (NextAuth.js):
- **accounts** - OAuth provider accounts
- **sessions** - User session data
- **verification_tokens** - Email verification tokens

## 🔍 Database Verification

### Check Database Connection:
```typescript
// Test database connection
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    const userCount = await prisma.user.count()
    console.log(`Users in database: ${userCount}`)
    
    const courseCount = await prisma.course.count()
    console.log(`Courses in database: ${courseCount}`)
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
```

### Verify Seeded Data:
```bash
# Check if courses were seeded
npx prisma studio

# Or via API endpoint
curl https://your-app-name.onrender.com/api/courses
```

## 🚀 Production Deployment Process

### 1. Deploy with Blueprint (Recommended):
```yaml
# render.yaml automatically configures DATABASE_URL
services:
  - type: web
    env_vars:
      - key: DATABASE_URL
        from_database:
          name: aiwhisperers-db
          property: connectionString
```

### 2. Manual Environment Setup:
1. **Create PostgreSQL database**
2. **Create web service** 
3. **Set DATABASE_URL** environment variable
4. **Deploy application**
5. **Migrations run automatically** via `postbuild`
6. **Seed database** with course content

### 3. Verify Deployment:
- **Health Check**: `https://your-app.onrender.com/api/health`
- **Courses API**: `https://your-app.onrender.com/api/courses`
- **Database Connection**: Should show real course data

## 🔧 Troubleshooting

### Common Issues:

#### Database Connection Errors:
```
Error: P1001: Can't reach database server
```
**Solutions**:
- Verify DATABASE_URL is correct
- Use **Internal URL** for Render web services
- Use **External URL** for local development
- Check database service is running

#### Migration Errors:
```
Error: Migration failed to apply
```
**Solutions**:
- Check database permissions
- Verify schema syntax
- Reset database if needed: `npx prisma migrate reset`

#### Seeding Errors:
```
Error: Failed to seed database
```
**Solutions**:
- Ensure migrations ran first
- Check DATABASE_URL connection
- Verify seed script syntax

### Connection String Format:
```bash
# Correct format
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Common issues
❌ Missing sslmode for production
❌ Wrong host (external vs internal)
❌ Incorrect credentials
```

## 🎯 Next Steps After Database Setup

1. **✅ Database Created** - PostgreSQL running on Render
2. **✅ Environment Variables** - DATABASE_URL configured
3. **✅ Migrations Applied** - Schema deployed
4. **✅ Data Seeded** - Courses populated
5. **✅ API Working** - Real database queries
6. **🚀 Ready for Production** - Full platform operational

---

*This database setup provides a production-ready PostgreSQL database with complete course content worth $150,000+ ready for your AI education platform.*