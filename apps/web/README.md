# AI Whisperers LMS - Web Application

Next.js 15 web application for the AI Whisperers Learning Management System.

## 🚀 Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.9.2
- **Styling**: Tailwind CSS 3.4.13
- **Auth**: NextAuth.js v5 (Database sessions)
- **Database**: Prisma + PostgreSQL (via @aiwhisperers/database)
- **AI**: Anthropic Claude + OpenAI (via ai SDK)

## 📦 Development

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## 🏗️ Architecture

This application uses:

- **Server Components** for SEO and performance
- **Client Components** for interactivity
- **API Routes** for backend logic
- **Middleware** for i18n, auth, and rate limiting
- **5-Layer Global State** (Security → Logic → DesignSystem → Presentation → i18n)

## 📁 Structure

```
apps/web/
├── src/
│   ├── app/                    # App Router (pages + API routes)
│   ├── components/             # React components
│   ├── contexts/               # React Context providers (5-layer state)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Business logic and utilities
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utility functions
│   ├── config/                 # Configuration files
│   └── middleware.ts           # Next.js middleware
├── public/                     # Static assets
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Package dependencies
```

## 🌍 Internationalization

Supports English (en) and Spanish (es) with:
- SSR-compatible i18n routing
- Instant language switching
- SEO-optimized locale URLs
- YAML-based content management

## 🔒 Authentication

NextAuth.js v5 with:
- Database session strategy
- Google OAuth provider
- Credentials provider
- Role-based access control (STUDENT, INSTRUCTOR, ADMIN)

## 📊 Features

- ✅ Course catalog with enrollment
- ✅ User dashboard with progress tracking
- ✅ Admin panel with analytics
- ✅ AI chatbot integration
- ✅ Rate limiting on API routes
- ✅ Dark mode support
- ✅ Responsive design

## 🔗 Monorepo Integration

Uses shared packages:
- `@aiwhisperers/database` - Prisma client and database access
- `@aiwhisperers/config-typescript` - TypeScript configuration
- `@aiwhisperers/config-eslint` - ESLint rules (future)
- `@aiwhisperers/config-tailwind` - Tailwind theme (future)

## 📝 Environment Variables

See `.env.example` for required environment variables.

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Application URL

**Optional:**
- `GOOGLE_CLIENT_ID` - Google OAuth
- `GOOGLE_CLIENT_SECRET` - Google OAuth
- `OPENAI_API_KEY` - OpenAI API
- `ANTHROPIC_API_KEY` - Anthropic API

## 🚢 Deployment

Deployed on Render.com with Docker:

```bash
# Build for production
npm run build

# Start production server
npm start
```

See `DEPLOYMENT.md` in the root for full deployment instructions.

---

**Version**: 0.1.0
**Last Updated**: 2025-10-10
