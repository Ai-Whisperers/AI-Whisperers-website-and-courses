# AI Whisperers - Getting Started Guide (Updated)

## 🚀 Quick Start (Simplified - No Database Required)

This guide will help you set up the AI Whisperers educational platform for local development in under **5 minutes**. The new architecture eliminates database setup complexity.

### Prerequisites (Minimal)

- **Node.js** (v18.0.0 or later) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Memory**: Minimum 4GB RAM (8GB recommended for development)
- **Storage**: At least 1GB free space
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)

**Note**: ✅ **No PostgreSQL or Database Required** - We've eliminated database dependencies!

## 📦 Installation (Simplified)

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/Ai-Whisperers/AI-Whisperers-website-and-courses.git

# Navigate to the project directory
cd AI-Whisperers-website-and-courses

# Install dependencies
npm install
```

### Step 2: Environment Configuration (Optional)

```bash
# Copy environment template
cp .env.example .env

# Edit environment file (all settings are optional)
# Basic setup works without any environment variables
```

**Environment Variables** (All Optional):
```bash
# Authentication (Optional - app works without OAuth)
NEXTAUTH_SECRET="development-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"  
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Step 3: Start Development

```bash
# Compile content and start development server
npm run dev

# Or run steps separately:
npm run compile-content  # Compile YAML content to TypeScript
npm run dev              # Start development server
```

**That's it!** 🎉 The application is now running at `http://localhost:3000`

## 🎯 Development Workflow

### Daily Development Commands

```bash
# Start development server (includes content compilation)
npm run dev

# Manual content compilation (if editing YAML files)
npm run compile-content

# Build for production testing
npm run build

# Start production server locally
npm start

# Run linting
npm run lint

# Run tests
npm test
```

### Content Development Workflow

1. **Edit Content**: Modify YAML files in `src/content/pages/`
2. **Auto-compilation**: Development server automatically recompiles content
3. **Hot Reload**: Changes appear immediately in browser
4. **Validation**: Console shows compilation status and any errors

**Example**:
```bash
# Edit content
vim src/content/pages/homepage.yml

# Development server automatically:
# 1. Detects file change
# 2. Recompiles content
# 3. Reloads page with new content
```

### Component Development Workflow

1. **Create Component**: Add new component to `src/components/`
2. **Use Content**: Import content with `getPageContent(pageName)`
3. **Type Safety**: TypeScript ensures content structure compatibility
4. **Testing**: Test with both real and fallback content

## 🏗️ Project Structure Understanding

### Key Directories

```
AI-Whisperers-Website-and-Courses/
├── src/
│   ├── app/                    # Next.js App Router (pages and API routes)
│   ├── components/             # React components (UI, pages, layout)
│   ├── content/pages/          # YAML content files (edit these)
│   ├── lib/content/compiled/   # Generated TypeScript (auto-generated)
│   ├── domain/                 # Business logic and entities
│   ├── hooks/                  # React hooks
│   └── types/                  # TypeScript type definitions
├── scripts/                    # Build scripts (content compilation)
├── docs/                       # Documentation (you are here)
├── public/                     # Static assets
└── Configuration files (package.json, next.config.ts, etc.)
```

### Important Files

**Configuration**:
- `package.json`: Dependencies and build scripts
- `next.config.ts`: Next.js configuration (standalone mode)
- `tailwind.config.ts`: Styling configuration
- `.env.example`: Environment variable template

**Content System**:
- `scripts/compile-content.js`: Content compilation script
- `src/content/pages/*.yml`: Source content files (edit these)
- `src/lib/content/compiled/*`: Generated TypeScript (don't edit)
- `src/lib/content/server-compiled.ts`: Content loading service

**Core Application**:
- `src/app/layout.tsx`: Root layout with providers
- `src/app/page.tsx`: Homepage
- `src/app/*/page.tsx`: Individual pages
- `src/app/api/*/route.ts`: API endpoints

## 🎨 Development Tips

### Content Editing Tips

1. **YAML Syntax**: Use proper YAML syntax (spaces, not tabs)
2. **Required Fields**: Always include meta section with title, description, keywords
3. **Validation**: Check console for compilation errors
4. **Structure**: Follow existing content file patterns for consistency

### Component Development Tips

1. **Content Loading**: Always use `getPageContent(pageName)` for content
2. **Fallback Handling**: Components should handle fallback content gracefully  
3. **Type Safety**: Leverage TypeScript for content structure validation
4. **Performance**: Content is pre-compiled, no need to optimize loading

### Debugging Tips

**Content Issues**:
```bash
# Check content compilation
npm run compile-content

# Verify generated TypeScript
cat src/lib/content/compiled/homepage.ts

# Check content loading in development
npm run dev
# Watch console for content loading messages
```

**Build Issues**:
```bash
# Full build test
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Analyze bundle size
ANALYZE=true npm run build
```

## 🔧 Common Development Tasks

### Adding a New Page

1. **Create Content File**:
   ```bash
   # Create content file
   touch src/content/pages/newpage.yml
   ```

2. **Add Content Structure**:
   ```yaml
   meta:
     title: "New Page - AI Whisperers"
     description: "Description of the new page"
     keywords:
       - "relevant keyword"
     language: "en"
   
   hero:
     title: "New Page Title"
     subtitle: "Page subtitle"
     description: "Page description"
   ```

3. **Create Page Route**:
   ```bash
   mkdir src/app/newpage
   touch src/app/newpage/page.tsx
   ```

4. **Implement Page Component**:
   ```typescript
   import { getPageContent } from '@/lib/content/server'
   
   export default async function NewPage() {
     const content = await getPageContent('newpage')
     return <div>{content.hero.title}</div>
   }
   ```

### Modifying Existing Pages

1. **Edit Content**: Modify YAML file in `src/content/pages/`
2. **Test Changes**: Development server automatically recompiles
3. **Verify Structure**: Check that component expects the content structure
4. **Build Test**: Run `npm run build` to verify production build

### Internationalization Setup

1. **Create Language-Specific Content**:
   ```bash
   cp src/content/pages/services.yml src/content/pages/servicios.yml
   # Edit servicios.yml for Spanish content
   ```

2. **Create Language-Specific Page**:
   ```bash
   mkdir src/app/servicios
   touch src/app/servicios/page.tsx
   ```

3. **Ensure Correct Content Loading**:
   ```typescript
   // In src/app/servicios/page.tsx
   const content = await getPageContent('servicios') // Spanish content
   ```

## 🛡️ Security Best Practices

### Environment Variables

1. **Never Commit Secrets**: The `.env` file is gitignored
2. **Use Strong Secrets**: Generate secure `NEXTAUTH_SECRET`
3. **OAuth Security**: Configure OAuth redirects properly
4. **Development vs Production**: Use different secrets for different environments

### Development Security

1. **Local Environment**: Use development-only secrets locally
2. **HTTPS in Production**: Always use HTTPS for OAuth callbacks
3. **Secret Rotation**: Rotate secrets periodically
4. **Access Control**: Limit repository access appropriately

## 📝 Troubleshooting Development Issues

### Common Setup Issues

#### **1. Node.js Version Issues**
```
Error: unsupported engine
```
**Solution**: Update to Node.js 18+ or adjust package.json engines

#### **2. Content Compilation Fails**
```
Error in YAML file syntax
```
**Solution**: Check YAML syntax, ensure proper indentation

#### **3. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Kill process on port 3000 or use different port

#### **4. Environment Variables Not Loading**
```
Warning: Missing environment variables
```
**Solution**: Verify .env file exists and has correct variable names

### Getting Help

1. **Documentation**: Check relevant documentation files
2. **Console Logs**: Watch browser and terminal for detailed error messages  
3. **Build Logs**: Run `npm run build` to see detailed compilation output
4. **Community**: Check GitHub issues for similar problems

## 🎓 Learning the Codebase

### Recommended Learning Path

1. **Start with Content**: Understand the content system (YAML → TypeScript)
2. **Explore Components**: Look at page components and how they use content
3. **API Endpoints**: Examine API routes for backend functionality
4. **Authentication**: Understand JWT-based auth system
5. **Domain Logic**: Explore domain entities and business logic

### Key Files to Study

**Entry Points**:
- `src/app/layout.tsx`: Application root with providers
- `src/app/page.tsx`: Homepage implementation
- `src/lib/content/server.ts`: Content loading system

**Systems**:
- `src/lib/auth/config.ts`: Authentication configuration
- `scripts/compile-content.js`: Content compilation system
- `src/domain/entities/course.ts`: Business entity example

**Examples**:
- `src/app/courses/page.tsx`: Complex page with mock data
- `src/components/pages/DynamicHomepage.tsx`: Advanced component
- `src/app/api/health/route.ts`: Simple API endpoint

---

## 🔗 Next Steps

After completing setup:

1. **Read Architecture**: [Architecture Documentation](./ARCHITECTURE.md)
2. **Understand Content**: [Content System Documentation](./CONTENT_SYSTEM.md)
3. **Explore Components**: Browse the `src/components/` directory
4. **Try Deployment**: Follow [Deployment Guide](./DEPLOYMENT.md)

*This getting started guide reflects the simplified architecture as of September 4, 2025, with database-free setup and build-time content compilation.*