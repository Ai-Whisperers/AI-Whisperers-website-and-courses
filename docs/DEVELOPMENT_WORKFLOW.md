# AI Whisperers - Development Workflow

## 🔄 Daily Development Workflow

This guide provides comprehensive workflow instructions for developing on the AI Whisperers platform with the new build-time content compilation system.

### 🌅 Starting Your Development Day

#### **Quick Start Routine**:
```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies  
npm install

# 3. Compile content and start development
npm run dev
# This automatically compiles content and starts the dev server
```

#### **Full Start Routine** (if issues):
```bash
# 1. Clean state
rm -rf .next/ node_modules/
npm install

# 2. Compile content fresh
npm run compile-content

# 3. Start development
npm run dev
```

### 🎯 Development Commands Reference

#### **Core Commands**:
```bash
npm run dev              # Start development server (includes content compilation)
npm run compile-content  # Manual content compilation  
npm run build           # Production build test
npm start               # Production server (after build)
npm run lint            # Code linting
npm test                # Run tests
```

#### **Advanced Commands**:
```bash
npm run dev:stable      # Development without Turbopack
ANALYZE=true npm run build # Bundle analysis
npx tsc --noEmit       # TypeScript error checking
npm audit              # Security vulnerability check
```

## 📝 Content Development Workflow

### Adding New Content

#### **1. Create Content File**:
```bash
# Create new YAML content file
touch src/content/pages/newpage.yml
```

#### **2. Add Content Structure**:
```yaml
meta:
  title: "New Page - AI Whisperers"
  description: "Description of your new page"
  keywords:
    - "relevant keyword"
    - "another keyword"
  language: "en"

hero:
  title: "New Page Title"
  subtitle: "Compelling subtitle"
  description: "Detailed description of what this page offers"

# Add other sections as needed based on page component requirements
```

#### **3. Compile and Test**:
```bash
# Compile content
npm run compile-content

# Verify compilation
ls src/lib/content/compiled/newpage.ts

# Test in development
npm run dev
# Visit: http://localhost:3000/newpage
```

### Modifying Existing Content

#### **Content Update Process**:
```bash
# 1. Edit YAML file
vim src/content/pages/homepage.yml

# 2. Development server automatically detects changes
# 3. Content recompiled automatically
# 4. Browser refreshes with new content

# Manual compilation (if needed)
npm run compile-content
```

#### **Content Structure Validation**:
```bash
# Check content compilation output
npm run compile-content

# Look for success messages:
# ✅ Compiled: homepage.ts
# 🎉 Content compilation complete!

# Check for warnings:
# ⚠️ homepage missing meta.description, adding fallback
```

### Internationalization Workflow

#### **Adding Spanish Content**:
```bash
# 1. Copy English content file
cp src/content/pages/services.yml src/content/pages/servicios.yml

# 2. Translate content in servicios.yml
vim src/content/pages/servicios.yml
# Update language: "es"
# Translate all text content

# 3. Create Spanish page route
mkdir src/app/servicios
touch src/app/servicios/page.tsx

# 4. Implement page with correct content loading
# getPageContent('servicios') // Spanish content
```

#### **Verifying Language Content**:
```bash
# Check Spanish content compilation
npm run compile-content
ls src/lib/content/compiled/servicios.ts

# Test Spanish page
npm run dev
# Visit: http://localhost:3000/servicios
```

## 🧩 Component Development Workflow

### Creating New Page Components

#### **1. Create Component Structure**:
```bash
# Create page component file
touch src/components/pages/NewPage.tsx
```

#### **2. Implement Component**:
```typescript
'use client'

import type { PageContent } from "@/types/content"

interface NewPageProps {
  content: PageContent
}

export function NewPage({ content }: NewPageProps) {
  const { meta, hero, navigation, footer } = content

  return (
    <div>
      {/* Use navigation if component requires it */}
      {navigation && (
        <nav>
          <span>{navigation.brand.text}</span>
        </nav>
      )}
      
      <main>
        <h1>{hero.title}</h1>
        <p>{hero.description}</p>
      </main>
      
      {/* Use footer if component requires it */}
      {footer && (
        <footer>
          <p>{footer.copyright}</p>
        </footer>
      )}
    </div>
  )
}
```

#### **3. Create Page Route**:
```typescript
// src/app/newpage/page.tsx
import { getPageContent } from '@/lib/content/server'
import { NewPage } from '@/components/pages/NewPage'

export default async function NewPageRoute() {
  const content = await getPageContent('newpage')
  return <NewPage content={content} />
}
```

### Component Testing Workflow

#### **Local Testing**:
```bash
# Test component with real content
npm run dev
# Navigate to page and test functionality

# Test component with fallback content
# Temporarily rename content file to trigger fallback
mv src/content/pages/newpage.yml src/content/pages/newpage.yml.bak
npm run compile-content
npm run dev
# Verify component handles fallback content gracefully
```

## 🔧 API Development Workflow

### Creating New API Endpoints

#### **1. Create Route File**:
```bash
# Create new API endpoint
mkdir -p src/app/api/newendpoint
touch src/app/api/newendpoint/route.ts
```

#### **2. Implement API Route**:
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // API logic here
    const data = { message: 'Hello from API' }
    
    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

#### **3. Test API Endpoint**:
```bash
# Start development server
npm run dev

# Test endpoint
curl http://localhost:3000/api/newendpoint

# Or test in browser DevTools
fetch('/api/newendpoint').then(r => r.json()).then(console.log)
```

## 🔄 Git Workflow

### Feature Development Workflow

#### **1. Branch Creation** (if using feature branches):
```bash
git checkout -b feature/new-feature-name
```

#### **2. Development Process**:
```bash
# Make changes
vim src/content/pages/homepage.yml

# Test changes
npm run dev

# Compile content for production test
npm run build
```

#### **3. Commit Process**:
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add hero section to homepage content

- Updated homepage.yml with new hero section
- Added compelling call-to-action
- Improved SEO meta description
"

# Push changes
git push origin main
```

### Content Change Workflow

#### **Content-Only Changes**:
```bash
# 1. Edit content
vim src/content/pages/about.yml

# 2. Test compilation
npm run compile-content

# 3. Test in browser
npm run dev

# 4. Commit content changes
git add src/content/pages/about.yml
git commit -m "Update about page hero section"
git push origin main
```

#### **Large Content Updates**:
```bash
# 1. Update multiple content files
vim src/content/pages/*.yml

# 2. Recompile all content
npm run compile-content

# 3. Test production build
npm run build

# 4. Commit all content changes
git add src/content/
git commit -m "Major content update across all pages

- Updated hero sections for better engagement
- Standardized navigation structure
- Added missing footer sections
"
git push origin main
```

## 🧪 Testing Workflow

### Pre-commit Testing

**Essential Tests**:
```bash
# 1. Content compilation test
npm run compile-content

# 2. Build test  
npm run build

# 3. TypeScript check (when ready)
npx tsc --noEmit

# 4. Security audit
npm audit
```

### Content Testing Workflow

**Content Validation**:
```bash
# Test content file syntax
node -e "
const yaml = require('js-yaml');
const fs = require('fs');
const content = yaml.load(fs.readFileSync('src/content/pages/homepage.yml', 'utf-8'));
console.log('Content sections:', Object.keys(content));
"

# Test compiled content
npm run compile-content
cat src/lib/content/compiled/homepage.ts | head -20
```

**Visual Testing**:
```bash
# Start development server
npm run dev

# Test pages manually:
# http://localhost:3000/           (homepage)
# http://localhost:3000/about     (about page)
# http://localhost:3000/courses   (courses)
# http://localhost:3000/contacto  (Spanish contact)
```

## 🚀 Production Testing Workflow

### Local Production Testing

#### **Production Build Test**:
```bash
# Test production build locally
NODE_ENV=production npm run build

# Start production server locally
npm start

# Test production site
curl http://localhost:3000/api/health

# Test key pages
open http://localhost:3000
open http://localhost:3000/courses
open http://localhost:3000/servicios
```

#### **Performance Testing**:
```bash
# Bundle analysis
ANALYZE=true npm run build

# Check bundle sizes in browser
# Verify no unusually large bundles
```

### Deployment Testing

#### **Pre-deployment Checklist**:
```bash
# 1. Verify build works
npm run build

# 2. Check environment variables
# Ensure no secrets committed
git status | grep -i env

# 3. Test health check locally
npm start &
curl http://localhost:3000/api/health
kill %1

# 4. Push to trigger deployment
git push origin main
```

#### **Post-deployment Verification**:
```bash
# Test health check
curl https://your-app.onrender.com/api/health

# Test key pages
curl -s -o /dev/null -w "%{http_code}" https://your-app.onrender.com/
curl -s -o /dev/null -w "%{http_code}" https://your-app.onrender.com/courses
curl -s -o /dev/null -w "%{http_code}" https://your-app.onrender.com/servicios
```

## 🛠️ Debugging Workflow

### Content Issues Debugging

#### **Content Compilation Problems**:
```bash
# Check YAML syntax
npm run compile-content

# Debug specific file
node -e "
const yaml = require('js-yaml');
const fs = require('fs');
try {
  const content = yaml.load(fs.readFileSync('src/content/pages/problematic.yml', 'utf-8'));
  console.log('✅ Valid YAML:', Object.keys(content));
} catch (error) {
  console.log('❌ YAML Error:', error.message);
}
"
```

#### **Content Loading Problems**:
```bash
# Check compiled content exists
ls src/lib/content/compiled/

# Check content map
node -e "
const { getCompiledPageContent } = require('./src/lib/content/compiled');
console.log('Available content:', Object.keys(require('./src/lib/content/compiled').contentMap));
"
```

### Build Issues Debugging

#### **Build Failure Investigation**:
```bash
# Verbose build output
DEBUG=* npm run build

# Check specific build steps
npm run compile-content  # Step 1: Content
npm install               # Step 2: Dependencies  
npx next build           # Step 3: Next.js build
```

#### **TypeScript Issues**:
```bash
# Check all TypeScript errors
npx tsc --noEmit

# Check specific file
npx tsc --noEmit src/components/pages/AboutPage.tsx
```

### Authentication Debugging

#### **OAuth Setup Issues**:
```bash
# Test OAuth providers
curl http://localhost:3000/api/auth/providers

# Expected response includes configured providers
# If empty, check environment variables
```

#### **JWT Token Issues**:
```bash
# Check NextAuth configuration
npm run dev
# Visit: http://localhost:3000/api/auth/session
# Should return session data or null
```

## 📊 Code Quality Workflow

### Code Review Checklist

**Before Submitting Changes**:
- [ ] Content compilation successful
- [ ] Build completes without errors
- [ ] No new TypeScript errors introduced
- [ ] Authentication still working
- [ ] All pages load correctly
- [ ] No console errors in browser

**Code Quality Checks**:
```bash
# Type safety check
npx tsc --noEmit

# Lint check
npm run lint

# Security audit
npm audit

# Bundle size check
npm run build
# Check output for bundle size information
```

### Performance Optimization Workflow

#### **Bundle Optimization**:
```bash
# Analyze bundle composition
ANALYZE=true npm run build

# Check for:
# - Large dependencies that could be optimized
# - Duplicate code that could be shared
# - Unused dependencies that could be removed
```

#### **Content Optimization**:
```bash
# Check content compilation efficiency
npm run compile-content

# Look for:
# - Large content files that could be split
# - Redundant content that could be shared
# - Missing content optimizations
```

## 🔄 Release Workflow

### Pre-release Testing

```bash
# 1. Full clean build
rm -rf .next/ node_modules/ src/lib/content/compiled/
npm install
npm run build

# 2. Production testing
npm start &
sleep 5
curl http://localhost:3000/api/health
curl http://localhost:3000/
kill %1

# 3. Security audit
npm audit

# 4. TypeScript validation (when enabled)
npx tsc --noEmit
```

### Release Process

```bash
# 1. Update version (if using semantic versioning)
npm version patch  # or minor, major

# 2. Create release commit
git add .
git commit -m "Release v1.0.1

- Updated homepage content for better engagement
- Fixed navigation structure across all pages
- Enhanced TypeScript type safety
- Improved build performance
"

# 3. Tag release
git tag -a v1.0.1 -m "Release version 1.0.1"

# 4. Push release
git push origin main --tags

# 5. Verify deployment
# Check Render dashboard for successful deployment
```

## 🔄 Hotfix Workflow

### Critical Issue Response

```bash
# 1. Create hotfix branch (if using git flow)
git checkout -b hotfix/critical-fix

# 2. Make minimal fix
# Edit only necessary files

# 3. Test fix
npm run build
npm start &
# Test the specific issue is resolved
kill %1

# 4. Deploy hotfix
git add .
git commit -m "Hotfix: Resolve critical content loading issue"
git push origin main

# 5. Monitor deployment
# Watch Render dashboard for successful deployment
# Test production site immediately
```

### Content Hotfix

```bash
# Quick content fix
vim src/content/pages/problematic.yml
npm run compile-content  # Verify fix
git add src/content/
git commit -m "Hotfix: Add missing navigation to contact page"
git push origin main
```

## 🔍 Code Organization Workflow

### File Organization Principles

**Content Files**: `src/content/pages/`
- One YAML file per page
- Language-specific files (servicios.yml for Spanish)
- Consistent naming conventions

**Components**: `src/components/`
- Page components in `pages/` subdirectory
- UI components in `ui/` subdirectory  
- Business components in relevant subdirectories

**API Routes**: `src/app/api/`
- RESTful endpoint structure
- Consistent error handling patterns
- Type-safe request/response handling

### Code Style Guidelines

#### **Content Files**:
```yaml
# Use consistent YAML formatting
meta:
  title: "Title Here"      # Strings in quotes
  keywords:                # Arrays properly indented
    - "keyword one"
    - "keyword two"
```

#### **TypeScript Files**:
```typescript
// Use proper TypeScript typing
export interface ComponentProps {
  content: PageContent     // Explicit types
}

// Consistent error handling
try {
  // Logic here
} catch (error) {
  console.error('Specific error context:', error)
  // Return fallback or error response
}
```

## 📚 Learning Workflow

### Understanding the Codebase

#### **Recommended Learning Path**:

1. **Content System** (Start Here):
   - Read `docs/CONTENT_SYSTEM.md`
   - Examine `src/content/pages/homepage.yml`
   - Look at `src/lib/content/compiled/homepage.ts`
   - Understand `scripts/compile-content.js`

2. **Page Structure**:
   - Study `src/app/page.tsx` (homepage)
   - Look at `src/components/pages/DynamicHomepage.tsx`
   - Understand content → component flow

3. **API System**:
   - Examine `src/app/api/health/route.ts`
   - Look at `src/app/api/courses/route.ts`
   - Understand API patterns

4. **Authentication**:
   - Study `src/lib/auth/config.ts`
   - Look at `src/hooks/use-auth.ts`
   - Test authentication flow

#### **Code Reading Sessions**:
```bash
# Explore content system
cat src/content/pages/homepage.yml
cat src/lib/content/compiled/homepage.ts
cat scripts/compile-content.js

# Explore component structure
find src/components/ -name "*.tsx" | head -5 | xargs cat

# Explore API structure
find src/app/api/ -name "route.ts" | xargs cat
```

---

## 🔗 Related Workflow Documentation

- **Architecture**: [Architecture Overview](./ARCHITECTURE.md)
- **Content**: [Content System](./CONTENT_SYSTEM.md)  
- **Deployment**: [Deployment Guide](./DEPLOYMENT.md)
- **Troubleshooting**: [Troubleshooting Guide](./TROUBLESHOOTING.md)

*This development workflow guide reflects the current build-time content compilation system and simplified architecture as of September 4, 2025.*