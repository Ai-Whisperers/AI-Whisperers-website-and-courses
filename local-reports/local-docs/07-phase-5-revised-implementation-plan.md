# 🐳 Phase 5 - Revised Implementation Plan: Deploy-Local Build Parity

**Created:** 2025-10-10
**Purpose:** Corrected Phase 5 plan ensuring deploy-local parity without premature microservices separation
**Scope:** Docker Compose configuration matching Render.com production deployment exactly

---

## 🎯 Critical Understanding: Current Architecture

### ⚠️ **IMPORTANT: We Are NOT Creating Separate Services Yet**

Based on the refactor plan, we are in **Phase 5 of 7**:

**Phases 0-6**: Hybrid Next.js Monolith (Current)
```
Single Service on Render.com:
├── apps/web (Next.js 15)
│   ├── Frontend: React Server/Client Components in src/app/
│   └── Backend: API Routes in src/app/api/
└── Database: PostgreSQL (external service)
```

**Phase 7+**: Microservices Separation (Future)
```
Multiple Services:
├── apps/web    → Frontend Service (Next.js SSR/SSG)
└── apps/api    → Backend Service (Express/Fastify)
```

### 🚨 Phase 5 Goal: Deploy-Local Parity

**NOT**: Separate frontend/backend containers
**YES**: Single Next.js container matching Render + Local PostgreSQL + Redis

---

## 📊 Current vs. Target State

### Current Production (Render.com)
```yaml
services:
  - type: web
    name: ai-whisperers-web
    runtime: docker
    plan: starter
    dockerfilePath: ./Dockerfile
    healthCheckPath: /api/health
    envVars:
      - NODE_ENV: production
      - DATABASE_URL: postgresql://... (external)
```

**What Render Actually Runs:**
1. **Single Docker Container** - Next.js standalone server
2. **Port 10000** - Web service (frontend + backend API)
3. **External PostgreSQL** - Managed database service
4. **No Redis** - Not yet implemented

### Current Local Development
```
Problems:
❌ No local PostgreSQL - must use remote Render database
❌ No Redis - can't test caching locally
❌ Dockerfile is pre-monorepo - inefficient builds
❌ docker-compose.yml is incomplete - missing services
```

### Phase 5 Target (Deploy-Local Parity)
```yaml
services:
  # 1. Web service (matches Render exactly)
  web:
    - Single Next.js container
    - Frontend + Backend API in one service
    - Port 3000 locally (Render uses 10000)
    - Connects to local postgres + redis

  # 2. PostgreSQL (new - for local dev)
  postgres:
    - PostgreSQL 16 (matches Render's version)
    - Port 5432
    - Persistent data volume

  # 3. Redis (new - future-proofing)
  redis:
    - Redis 7 (latest stable)
    - Port 6379
    - Persistent data volume

  # 4. Management UIs (optional - dev profile only)
  pgadmin:
    - Database management
  redis-commander:
    - Redis management
```

---

## ⚠️ Issues Identified in Original Phase 5 Plan

### Issue 1: Premature Service Separation
**Original Plan Proposed:**
```yaml
services:
  web-dev:    # Development service
  web-prod:   # Production service
```

**Problem:** Creates confusion about which service to use
**Fix:** Single `web` service that adapts to NODE_ENV

### Issue 2: Overly Complex Profiles
**Original Plan Proposed:**
- `dev` profile (development)
- `staging` profile (production-like)
- `prod` profile (production simulation)

**Problem:** Too many profiles, unclear when to use each
**Fix:** Two simple profiles:
- **default** (no profile flag) - Full stack development
- **prod** (--profile prod) - Production-like testing

### Issue 3: Dockerfile Not Monorepo-Aware
**Current Root Dockerfile:**
```dockerfile
# Copies everything, then navigates with cd commands
COPY . .
RUN npm run build:docker  # This does: cd apps/web && next build
```

**Problem:**
- Inefficient with monorepo structure
- Copies unnecessary workspace files
- No Turbo caching benefits
- Complex build script

**Fix:** Don't replace root Dockerfile (Render uses it), create docker-compose specific build context

### Issue 4: Missing Environment File Strategy
**Original Plan:** Separate .env files for each profile
**Problem:** Duplication and maintenance overhead
**Fix:** Single .env.local with intelligent defaults

---

## 🎯 Revised Phase 5 Implementation Strategy

### Design Principles
1. **Match Render Exactly** - Local web service mirrors production
2. **Keep It Simple** - One service, clear profiles
3. **Preserve Root Dockerfile** - Don't break Render deployment
4. **Monorepo-Aware** - Efficient builds with Turbo
5. **Future-Proof** - Ready for Phase 7 microservices

---

## 📁 File Structure Changes

### New Files to Create
```
docker/
├── docker-compose.yml          # ✅ Main compose file
├── docker-compose.dev.yml      # ✅ Development overrides
├── docker-compose.prod.yml     # ✅ Production-like overrides
├── .env.docker.example         # ✅ Environment template
└── README.md                   # ✅ Docker usage guide

.env.local                      # ✅ Local development environment (git-ignored)
```

### Files to Keep Unchanged
```
Dockerfile                      # ✅ Keep for Render deployment
.dockerignore                   # ✅ Already well-configured
render.yaml                     # ✅ Production deployment config
```

---

## 🔧 Implementation Details

### 1. Main docker-compose.yml

**Purpose:** Base configuration shared by all profiles
**Services:** postgres, redis, web

```yaml
# docker/docker-compose.yml
# Base configuration for AI Whisperers Platform
# Provides deploy-local parity with Render.com production

name: ai-whisperers

services:
  # ==========================================================================
  # PostgreSQL Database (Local Development)
  # ==========================================================================
  postgres:
    image: postgres:16-alpine
    container_name: aiwhisperers-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-aiwhisperers}
      POSTGRES_USER: ${POSTGRES_USER:-aiwhisperers}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-aiwhisperers_dev}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - aiwhisperers-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-aiwhisperers}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ==========================================================================
  # Redis Cache (Local Development)
  # ==========================================================================
  redis:
    image: redis:7-alpine
    container_name: aiwhisperers-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    networks:
      - aiwhisperers-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ==========================================================================
  # Web Application (Next.js Hybrid - Frontend + Backend API)
  # ==========================================================================
  web:
    build:
      context: ..
      dockerfile: Dockerfile
      target: runner
      args:
        - DATABASE_URL=postgresql://${POSTGRES_USER:-aiwhisperers}:${POSTGRES_PASSWORD:-aiwhisperers_dev}@postgres:5432/${POSTGRES_DB:-aiwhisperers}?schema=public
    container_name: aiwhisperers-web
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: ${NODE_ENV:-production}
      DATABASE_URL: postgresql://${POSTGRES_USER:-aiwhisperers}:${POSTGRES_PASSWORD:-aiwhisperers_dev}@postgres:5432/${POSTGRES_DB:-aiwhisperers}?schema=public
      REDIS_URL: redis://redis:6379
      NEXTAUTH_URL: http://localhost:${WEB_PORT:-3000}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:-dev_secret_change_in_production_32chars_min}
      NEXT_PUBLIC_SITE_URL: http://localhost:${WEB_PORT:-3000}
    env_file:
      - ../.env.local
    ports:
      - "${WEB_PORT:-3000}:3000"
    networks:
      - aiwhisperers-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

# ==========================================================================
# Volumes
# ==========================================================================
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

# ==========================================================================
# Networks
# ==========================================================================
networks:
  aiwhisperers-network:
    driver: bridge
```

### 2. Development Overrides (docker-compose.dev.yml)

**Purpose:** Hot-reload development mode
**Changes:** Mount source code, use development server

```yaml
# docker/docker-compose.dev.yml
# Development overrides - enables hot-reload and debugging
# Usage: docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

services:
  web:
    build:
      target: builder  # Stop at builder stage for dev dependencies
    environment:
      NODE_ENV: development
      CHOKIDAR_USEPOLLING: true  # Enable hot-reload in Docker
    command: sh -c "cd apps/web && pnpm dev"
    volumes:
      # Mount source code for hot-reload
      - ../apps:/app/apps:delegated
      - ../packages:/app/packages:delegated
      - ../scripts:/app/scripts:delegated
      # Preserve node_modules (don't overwrite container's)
      - /app/node_modules
      - /app/apps/web/node_modules
      - /app/apps/web/.next
      - /app/packages/database/node_modules
    ports:
      - "3000:3000"  # Next.js dev server

  # ==========================================================================
  # PgAdmin (Database Management UI)
  # ==========================================================================
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: aiwhisperers-pgadmin
    restart: unless-stopped
    depends_on:
      - postgres
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@aiwhisperers.local}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin}
    ports:
      - "${PGADMIN_PORT:-5050}:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    networks:
      - aiwhisperers-network

  # ==========================================================================
  # Redis Commander (Redis Management UI)
  # ==========================================================================
  redis-commander:
    image: ghcr.io/joeferner/redis-commander:latest
    container_name: aiwhisperers-redis-commander
    restart: unless-stopped
    depends_on:
      - redis
    environment:
      REDIS_HOSTS: local:redis:6379
    ports:
      - "${REDIS_COMMANDER_PORT:-8081}:8081"
    networks:
      - aiwhisperers-network

volumes:
  pgadmin_data:
    driver: local
```

### 3. Production Overrides (docker-compose.prod.yml)

**Purpose:** Production-like testing
**Changes:** Use production build, no source mounts

```yaml
# docker/docker-compose.prod.yml
# Production-like overrides for local testing
# Usage: docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

services:
  web:
    build:
      target: runner  # Use production runner stage
    environment:
      NODE_ENV: production
    # No volume mounts - uses built application
    ports:
      - "3001:3000"  # Different port to avoid conflict with dev
```

### 4. Environment File Template

**Purpose:** Document all required environment variables
**Location:** `docker/.env.docker.example`

```bash
# =============================================================================
# AI Whisperers Platform - Docker Environment Configuration
# =============================================================================
# Copy this file to ../.env.local and configure values
# DO NOT commit .env.local to version control

# =============================================================================
# Application
# =============================================================================
NODE_ENV=development
WEB_PORT=3000

# =============================================================================
# Database (PostgreSQL)
# =============================================================================
POSTGRES_DB=aiwhisperers
POSTGRES_USER=aiwhisperers
POSTGRES_PASSWORD=aiwhisperers_dev
POSTGRES_PORT=5432

# Connection URL (auto-generated from above)
# For local Docker: postgresql://aiwhisperers:aiwhisperers_dev@postgres:5432/aiwhisperers?schema=public
# For Render production: Use actual DATABASE_URL from Render dashboard

# =============================================================================
# Redis Cache
# =============================================================================
REDIS_PORT=6379
# Connection URL: redis://redis:6379

# =============================================================================
# NextAuth.js Authentication
# =============================================================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev_secret_change_in_production_minimum_32_characters_required_for_security

# OAuth Providers (optional - configure if using social login)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GITHUB_CLIENT_ID=your-github-client-id
# GITHUB_CLIENT_SECRET=your-github-client-secret

# =============================================================================
# Feature Flags
# =============================================================================
NEXT_PUBLIC_ENABLE_COURSES=true
NEXT_PUBLIC_ENABLE_STRIPE=false
NEXT_PUBLIC_ENABLE_AI_CHAT=false

# =============================================================================
# Payment Providers (optional - configure if using payments)
# =============================================================================
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# =============================================================================
# Email Service (optional - configure if using email)
# =============================================================================
# RESEND_API_KEY=re_...

# =============================================================================
# AI Services (optional - configure if using AI features)
# =============================================================================
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...

# =============================================================================
# Management UI Access
# =============================================================================
PGADMIN_EMAIL=admin@aiwhisperers.local
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050
REDIS_COMMANDER_PORT=8081

# =============================================================================
# Render Tunnel (optional - configure if using production tunnel)
# =============================================================================
# RENDER_TUNNEL_ENABLED=false
# RENDER_TUNNEL_SECRET=minimum_32_character_secret_for_tunnel_authentication
# RENDER_EXTERNAL_URL=https://your-app.onrender.com
```

### 5. Docker Usage Guide

**Purpose:** Document how to use the Docker setup
**Location:** `docker/README.md`

```markdown
# 🐳 Docker Setup - AI Whisperers Platform

## Quick Start

### Prerequisites
- Docker Desktop installed (includes docker-compose)
- Node.js 22+ (for local development without Docker)
- pnpm 10+ (for package management)

### Setup

1. **Copy environment file:**
   ```bash
   cp docker/.env.docker.example .env.local
   ```

2. **Edit .env.local with your values** (minimum: NEXTAUTH_SECRET)

### Development Mode (Hot-Reload)

**Start all services:**
```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**Services available:**
- **Web App**: http://localhost:3000
- **PgAdmin**: http://localhost:5050 (admin@aiwhisperers.local / admin)
- **Redis Commander**: http://localhost:8081

**Run database migrations:**
```bash
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:dev"
```

**View logs:**
```bash
docker-compose logs -f web
```

**Stop services:**
```bash
docker-compose down
```

### Production Mode (Testing)

**Start services:**
```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

**Service available:**
- **Web App**: http://localhost:3001

### Database Management

**Access PostgreSQL directly:**
```bash
docker-compose exec postgres psql -U aiwhisperers -d aiwhisperers
```

**Backup database:**
```bash
docker-compose exec postgres pg_dump -U aiwhisperers aiwhisperers > backup_$(date +%Y%m%d).sql
```

**Restore database:**
```bash
docker-compose exec -T postgres psql -U aiwhisperers aiwhisperers < backup.sql
```

**Reset database (caution - deletes all data):**
```bash
docker-compose down -v postgres
docker-compose up -d postgres
```

### Prisma Studio

**Open Prisma Studio (database GUI):**
```bash
docker-compose exec web sh -c "cd packages/database && pnpm run studio"
```

Access at: http://localhost:5555

### Troubleshooting

**Port already in use:**
```bash
# Change ports in .env.local
WEB_PORT=3001
POSTGRES_PORT=5433
REDIS_PORT=6380
```

**Permission errors:**
```bash
# On Linux/Mac, fix ownership
sudo chown -R $USER:$USER .
```

**Build cache issues:**
```bash
# Rebuild from scratch
docker-compose build --no-cache web
```

**Database connection refused:**
```bash
# Check database is healthy
docker-compose ps
docker-compose logs postgres

# Wait for health check to pass (can take 10-20 seconds)
```

### Clean Up

**Remove containers (keep data):**
```bash
docker-compose down
```

**Remove containers AND data:**
```bash
docker-compose down -v
```

**Remove unused Docker resources:**
```bash
docker system prune -a
```

## Architecture

### Service Communication
```
┌─────────────────────────────────────────────────────┐
│  Docker Compose Network (aiwhisperers-network)     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────┐      ┌──────────┐      ┌─────────┐  │
│  │   Web   │─────▶│ Postgres │      │  Redis  │  │
│  │ (3000)  │      │  (5432)  │      │ (6379)  │  │
│  └─────────┘      └──────────┘      └─────────┘  │
│       │                  │                │        │
│       │                  │                │        │
│  ┌────▼─────┐      ┌────▼─────┐    ┌────▼──────┐ │
│  │ Browser  │      │ PgAdmin  │    │   Redis   │ │
│  │localhost │      │  (5050)  │    │ Commander │ │
│  │  :3000   │      └──────────┘    │  (8081)   │ │
│  └──────────┘                      └───────────┘ │
└─────────────────────────────────────────────────────┘
```

### Data Persistence

- **postgres_data**: Database files (survives container restart)
- **redis_data**: Redis persistence (survives container restart)
- **pgadmin_data**: PgAdmin settings (survives container restart)

### Comparison: Development vs Production

| Feature | Docker Development | Render Production |
|---------|-------------------|-------------------|
| Web Service | Next.js dev server | Next.js production |
| Hot-Reload | ✅ Yes | ❌ No |
| Database | Local PostgreSQL 16 | Managed PostgreSQL 16 |
| Redis | Local Redis 7 | ❌ Not yet (planned) |
| Port | 3000 | 10000 |
| Build | On-demand | Pre-built image |

## FAQ

**Q: Why two docker-compose files?**
A: Separation of concerns - base config (docker-compose.yml) + environment-specific overrides (dev/prod). This is a Docker best practice.

**Q: Can I use this for production deployment?**
A: No - this is for local development only. Production uses Render.com with the root Dockerfile.

**Q: Do I need to rebuild after code changes?**
A: In development mode (docker-compose.dev.yml), no - hot-reload handles it. In production mode, yes - rebuild with `docker-compose build web`.

**Q: How is this different from running `pnpm dev` locally?**
A: Docker provides full environment parity (database, redis, networking). Local `pnpm dev` requires manual setup of PostgreSQL and Redis.

**Q: What about the root Dockerfile?**
A: It's used by Render.com for production deployment. This docker-compose setup uses it as well, ensuring consistency.
```

---

## 🚀 Implementation Steps

### Step 1: Create Docker Directory Structure
```bash
mkdir -p docker
```

### Step 2: Create docker-compose.yml
- Copy main configuration from above
- Test basic structure: `docker-compose config`

### Step 3: Create Development Overrides
- Copy docker-compose.dev.yml from above
- Add management UIs (pgadmin, redis-commander)

### Step 4: Create Production Overrides
- Copy docker-compose.prod.yml from above
- Minimal config for production testing

### Step 5: Create Environment Template
- Copy .env.docker.example from above
- Document all variables

### Step 6: Create Usage Guide
- Copy docker/README.md from above
- Document common commands

### Step 7: Create .env.local
```bash
cp docker/.env.docker.example .env.local
# Edit .env.local with development values
```

### Step 8: Test Development Mode
```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker-compose logs -f web
# Access http://localhost:3000
```

### Step 9: Test Database Connection
```bash
docker-compose exec web sh -c "cd packages/database && pnpm run generate"
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:dev"
```

### Step 10: Test Production Mode
```bash
docker-compose down
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
# Access http://localhost:3001
```

---

## ✅ Success Criteria

### Functional Requirements
- [ ] `docker-compose up` starts all services successfully
- [ ] Web service connects to PostgreSQL successfully
- [ ] Web service connects to Redis successfully
- [ ] Health checks pass for all services
- [ ] Development mode has hot-reload working
- [ ] Production mode serves optimized build
- [ ] Database migrations run successfully
- [ ] PgAdmin connects to database
- [ ] Redis Commander connects to Redis

### Non-Functional Requirements
- [ ] Startup time < 60 seconds (all services healthy)
- [ ] Hot-reload < 2 seconds for code changes
- [ ] No port conflicts with common services
- [ ] Data persists across container restarts
- [ ] Clear error messages for common issues
- [ ] Documentation covers all use cases

### Deploy-Local Parity Checklist
- [ ] Web service architecture matches Render (single service)
- [ ] Database version matches Render (PostgreSQL 16)
- [ ] Environment variables match Render configuration
- [ ] Health check endpoint matches Render (/api/health)
- [ ] Build process uses same Dockerfile as Render
- [ ] Network configuration allows service communication

---

## 🔄 Comparison: Original vs. Revised Plan

### Original Plan Issues

| Aspect | Original Plan | Issue |
|--------|---------------|-------|
| Service Count | 3 web services (dev, staging, prod) | Confusing, unnecessary |
| Profiles | 3 profiles (dev, staging, prod) | Too complex |
| Dockerfile | New monorepo-specific Dockerfile | Breaks Render deployment |
| Frontend/Backend | Implied separation | Premature for Phase 5 |
| Complexity | High (40+ checklist items) | Overwhelming |

### Revised Plan Advantages

| Aspect | Revised Plan | Benefit |
|--------|--------------|---------|
| Service Count | 1 web service + infrastructure | Simple, clear purpose |
| Profiles | 2 modes (dev, prod overrides) | Easy to understand |
| Dockerfile | Reuses root Dockerfile | Render parity guaranteed |
| Architecture | Hybrid monolith (current phase) | Matches Phase 0-6 plan |
| Complexity | Focused (10 steps) | Achievable in Phase 5 |

---

## 📚 Documentation Updates

### Files to Update
1. **refactor-plan.md**
   - Update Phase 5 checklist with revised tasks
   - Reference this document

2. **06-docker-infrastructure-analysis.md**
   - Add note about revised plan
   - Link to this document

3. **CLAUDE.md**
   - Update Docker setup instructions
   - Reference new docker/ directory

---

## 🎯 Phase 5 Deliverables

### Code
- [x] `docker/docker-compose.yml` - Base configuration
- [x] `docker/docker-compose.dev.yml` - Development overrides
- [x] `docker/docker-compose.prod.yml` - Production overrides
- [x] `docker/.env.docker.example` - Environment template
- [x] `docker/README.md` - Usage documentation
- [ ] `.env.local` - Local environment (git-ignored)

### Documentation
- [x] This implementation plan
- [x] Docker usage guide (docker/README.md)
- [ ] Updated refactor-plan.md
- [ ] Updated CLAUDE.md

### Testing
- [ ] All services start successfully
- [ ] Database migrations work
- [ ] Hot-reload works in dev mode
- [ ] Production mode works
- [ ] Health checks pass
- [ ] Data persists across restarts

---

## 🚦 Next Steps After Phase 5

### Phase 6: Testing
- Unit tests can run in Docker
- Integration tests use Docker services
- E2E tests use production-like mode

### Phase 7: Deployment
- **Then and only then** consider microservices separation
- Create `apps/api` for standalone backend
- Update Docker Compose for multiple services
- Deploy separate services to Render

---

**Document Version:** 1.0.0
**Status:** Ready for Implementation
**Approved for Phase 5:** ✅ Yes - Matches Phase 0-6 hybrid architecture
