# AI Whisperers - Getting Started Guide

## 🚀 Quick Start

This guide will help you set up the AI Whisperers educational platform for local development in under 10 minutes.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or later) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **PostgreSQL** (v14 or later) - [Download here](https://postgresql.org/) or use Docker

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: At least 2GB free space
- **Browser**: Modern browser for testing (Chrome, Firefox, Safari, Edge)

## 📦 Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Ai-Whisperers/AI-Whisperers-website-and-courses.git

# Navigate to the project directory
cd AI-Whisperers-website-and-courses

# Install dependencies
npm install
```

### Step 2: Database Setup

#### Option A: PostgreSQL (Recommended)

1. **Install PostgreSQL** (if not already installed)
2. **Create a database**:
   ```sql
   CREATE DATABASE aiwhisperers_dev;
   CREATE USER aiwhisperers_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE aiwhisperers_dev TO aiwhisperers_user;
   ```

#### Option B: Docker PostgreSQL

```bash
# Run PostgreSQL in Docker
docker run --name aiwhisperers-postgres \
  -e POSTGRES_DB=aiwhisperers_dev \
  -e POSTGRES_USER=aiwhisperers_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14
```

### Step 3: Environment Configuration

1. **Copy the environment template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your configuration:
   ```bash
   # Database Configuration
   DATABASE_URL="postgresql://aiwhisperers_user:your_password@localhost:5432/aiwhisperers_dev"

   # Authentication (generate a secure random string)
   NEXTAUTH_SECRET="your-super-secure-secret-string-here"
   NEXTAUTH_URL="http://localhost:3000"

   # Optional: OAuth Providers (for full auth features)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"

   # Optional: AI Services (for AI features)
   OPENAI_API_KEY="your-openai-api-key"
   ANTHROPIC_API_KEY="your-anthropic-api-key"
   ```

### Step 4: Database Setup and Seeding

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with course content ($150K+ value)
npm run db:seed
```

### Step 5: Start Development Server

```bash
# Start the development server
npm run dev

# Alternative: Use Turbopack (faster)
npm run dev
```

Your application will be available at `http://localhost:3000` 🎉

## 🔧 Development Environment

### Project Structure Overview

```
AI-Whisperers-website-and-courses/
├── 📁 src/                 # Source code
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── domain/           # Business logic (Hexagonal Architecture)
│   ├── infrastructure/   # External adapters
│   ├── lib/             # Application services
│   └── types/           # TypeScript definitions
├── 📁 docs/              # Technical documentation
├── 📁 courses/           # Course content ($150K+ value)
├── 📁 business-docs/     # Business strategy
├── 📁 prisma/           # Database schema and migrations
└── 📁 public/           # Static assets
```

### Key Development Commands

```bash
# Development
npm run dev              # Start development server
npm run dev:stable       # Start without Turbopack

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:migrate       # Create and run migrations
npm run db:seed          # Seed database with content

# Building
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run end-to-end tests
```

## 🎯 Core Features Overview

### 📚 Course Management System
- **4 Complete Courses**: AI Foundations, Applied AI, Web Development, Enterprise AI
- **Hierarchical Content**: Courses → Modules → Lessons
- **Progress Tracking**: Student progress monitoring
- **Certification**: Automatic certificate generation

### 🔐 Authentication System
- **Multi-Provider**: Google, GitHub, Email authentication
- **Role-Based Access**: Student, Instructor, Admin roles
- **Session Management**: Secure session handling with NextAuth.js

### 🌍 Internationalization
- **4 Languages**: English, Spanish, Portuguese, French
- **Dynamic Translation**: Real-time language switching
- **Localized Content**: Course content and UI translations

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant with Radix UI
- **Dark/Light Themes**: User preference support
- **Smooth Animations**: Framer Motion integration

### 🏗️ Architecture Highlights
- **Hexagonal Architecture**: Clean separation of concerns
- **Domain-Driven Design**: Rich domain models
- **SOLID Principles**: Maintainable and extensible code
- **TypeScript**: Full type safety

## 🧪 Testing Your Setup

### 1. Verify Application is Running

Visit `http://localhost:3000` and you should see:
- ✅ Homepage loads successfully
- ✅ Navigation menu is responsive
- ✅ Course catalog displays courses
- ✅ Authentication links work

### 2. Test Database Connection

```bash
# Open Prisma Studio to browse data
npx prisma studio
```

You should see:
- ✅ 4 courses with complete content
- ✅ Modules and lessons properly structured
- ✅ User roles and authentication tables

### 3. Test Course Content

1. Navigate to `/courses` - should show 4 courses
2. Click on a course - should show detailed course information
3. Check course modules and lessons are properly loaded

### 4. Test Authentication (if configured)

1. Navigate to `/auth/signin`
2. Try signing in with configured OAuth providers
3. Verify user session and role assignment

## 🔧 Configuration Options

### OAuth Provider Setup (Optional but Recommended)

#### Google OAuth

1. **Google Cloud Console**:
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials

2. **Configuration**:
   ```
   Authorized origins: http://localhost:3000
   Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
   ```

3. **Environment Variables**:
   ```bash
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

#### GitHub OAuth

1. **GitHub Settings**:
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Create new OAuth App

2. **Configuration**:
   ```
   Homepage URL: http://localhost:3000
   Callback URL: http://localhost:3000/api/auth/callback/github
   ```

3. **Environment Variables**:
   ```bash
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

### AI Services Setup (Optional)

#### OpenAI Configuration

```bash
# Add to .env.local
OPENAI_API_KEY="sk-your-openai-api-key"
```

#### Anthropic Claude Configuration

```bash
# Add to .env.local
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
```

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Database Connection Issues

**Error**: `P1001: Can't reach database server`

**Solutions**:
1. Verify PostgreSQL is running
2. Check database URL in `.env.local`
3. Ensure database exists and user has permissions
4. For Docker: ensure container is running

```bash
# Check PostgreSQL service
# macOS:
brew services list | grep postgresql

# Windows (if using PostgreSQL service):
net start postgresql

# Linux:
sudo systemctl status postgresql

# Docker:
docker ps | grep postgres
```

#### Prisma Issues

**Error**: `Prisma schema validation error`

**Solutions**:
1. Regenerate Prisma client: `npm run db:generate`
2. Reset database: `npx prisma migrate reset`
3. Check schema syntax in `prisma/schema.prisma`

#### NextAuth Configuration Issues

**Error**: `NEXTAUTH_SECRET is not set`

**Solutions**:
1. Add `NEXTAUTH_SECRET` to `.env.local`
2. Generate secure secret: `openssl rand -base64 32`
3. Ensure `.env.local` is in project root

#### Build Issues

**Error**: TypeScript compilation errors

**Solutions**:
1. Check for TypeScript errors: `npx tsc --noEmit`
2. Update dependencies: `npm update`
3. Clear cache: `rm -rf .next node_modules && npm install`

#### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:
1. Kill process using port: `lsof -ti:3000 | xargs kill`
2. Use different port: `npm run dev -- -p 3001`
3. Set port in environment: `PORT=3001 npm run dev`

## 🛠️ Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "Prisma.prisma",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Browser DevTools

1. **React DevTools**: Debug React components
2. **Redux DevTools**: State management debugging (if using Redux)
3. **Prisma Studio**: Database browsing and editing
4. **Network Tab**: API request monitoring

### Database Tools

1. **Prisma Studio**: Built-in database browser
   ```bash
   npx prisma studio
   ```

2. **pgAdmin**: PostgreSQL administration
3. **DBeaver**: Universal database tool
4. **TablePlus**: Modern database client (macOS/Windows)

## 📱 Mobile Development Testing

### Responsive Testing

1. **Browser DevTools**:
   - Open Chrome/Firefox DevTools
   - Toggle device toolbar
   - Test different screen sizes

2. **Physical Devices**:
   ```bash
   # Get your local IP
   # macOS/Linux:
   ifconfig | grep inet

   # Windows:
   ipconfig

   # Access from mobile:
   http://your-ip:3000
   ```

3. **Testing Checklist**:
   - ✅ Navigation menu works on mobile
   - ✅ Course cards are properly sized
   - ✅ Forms are usable on touch devices
   - ✅ Text is readable without zooming

## 🚀 Next Steps

### Development Workflow

1. **Feature Development**:
   - Create feature branch: `git checkout -b feature/new-feature`
   - Implement feature following architecture patterns
   - Write tests for new functionality
   - Update documentation as needed

2. **Database Changes**:
   - Modify `prisma/schema.prisma`
   - Create migration: `npx prisma migrate dev --name description`
   - Update seed data if needed

3. **Component Development**:
   - Follow existing component patterns
   - Use TypeScript for type safety
   - Implement responsive design
   - Add proper accessibility attributes

### Production Deployment

Ready to deploy? See our comprehensive [Deployment Guide](./DEPLOYMENT.md) for:
- Render.com deployment instructions
- Environment configuration
- Database setup
- OAuth provider configuration
- Monitoring and maintenance

### Contributing

1. **Code Style**:
   - Follow existing patterns
   - Use TypeScript strictly
   - Write meaningful commit messages
   - Add tests for new features

2. **Architecture Guidelines**:
   - Follow hexagonal architecture principles
   - Maintain clean separation of concerns
   - Use domain-driven design patterns
   - Implement proper error handling

## 📚 Learning Resources

### Platform-Specific Learning

After setup, explore these courses included in the platform:

1. **AI Foundations** (12 hours, $299 value)
   - Perfect for beginners
   - No-code approach
   - Comprehensive fundamentals

2. **Applied AI** (15 hours, $599 value)
   - API integration focus
   - Real-world projects
   - Technical implementation

3. **AI Web Development** (21 hours, $1,299 value)
   - Full-stack development
   - Production deployment
   - Advanced techniques

4. **Enterprise AI Business** (17.5 hours, $1,799 value)
   - Strategic planning
   - Business implementation
   - ROI frameworks

### Technical Documentation

- [Architecture Guide](./ARCHITECTURE.md) - Deep dive into system design
- [API Documentation](./API.md) - Complete REST API reference
- [Database Schema](./DATABASE.md) - Database design and relationships

---

*Congratulations! You now have a fully functional AI Whisperers development environment. The platform includes $150,000+ worth of educational content and enterprise-ready architecture. Happy coding! 🎉*