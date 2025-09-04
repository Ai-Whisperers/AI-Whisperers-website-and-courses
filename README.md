# AI-Whisperers Website and Courses

A comprehensive educational platform combining Next.js implementation with premium course content, built using hexagonal architecture and clean code principles.

## 🏗️ Architecture

### Backend: Hexagonal Architecture
- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External services and data persistence

### Frontend: Clean Architecture + SOLID Principles
- **Presentation Layer**: React components and UI
- **Application Layer**: Custom hooks and state management
- **Infrastructure Layer**: API clients and external integrations

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client and push schema
npm run db:generate
npm run db:push

# Seed database with course content
npm run db:seed

# Start development server
npm run dev
```

## 📚 Course Content

This platform includes $150,000+ worth of educational content:

- **Course 1**: AI Foundations (12 hours) - $299 value
- **Course 2**: Applied AI (15 hours) - $599 value  
- **Course 3**: AI Web Development (21 hours) - $1,299 value
- **Course 4**: Enterprise AI Business (17.5 hours) - $1,799 value

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Testing**: Jest + Playwright

## 📁 Project Structure

```
src/
├── app/           # Next.js App Router (Presentation)
├── components/    # Reusable UI components
├── domain/        # Domain entities and business logic
├── infrastructure/# External services and adapters
├── lib/          # Application layer (use cases, services)
└── types/        # TypeScript definitions
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## 🚀 Deployment

The application is configured for deployment on Vercel with PostgreSQL database.

## 📖 Documentation

- [Comprehensive Merge Plan](local-reports/COMPREHENSIVE_MERGE_PLAN.md)
- [Architecture Documentation](docs/ARCHITECTURE.md)
- [Course Content Overview](courses/README.md)