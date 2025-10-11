# 🐳 Docker Setup Guide

**Complete Docker Compose infrastructure for AI Whisperers Platform with deploy-local parity.**

> **✨ Phase 5 Complete:** Full-stack Docker environment with PostgreSQL 16, Redis 7, and management UIs

---

## 📋 Quick Links

- **Comprehensive Guide**: See [docker/README.md](docker/README.md) for detailed documentation
- **Configuration Files**: All Docker files are in the [docker/](docker/) directory
- **Phase 5 Implementation**: See [local-reports/local-docs/07-phase-5-revised-implementation-plan.md](local-reports/local-docs/07-phase-5-revised-implementation-plan.md)

---

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** 4.25+ (includes docker-compose)
- **10GB** free disk space
- **2GB** available RAM

### Setup (< 5 minutes)

**1. Copy environment template:**
```bash
cp docker/.env.docker.example .env.local
```

**2. Edit `.env.local`** (minimum requirement):
```bash
# Generate secret: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-32-character-secret-here
```

**3. Start development environment:**
```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**4. Run database migrations** (in new terminal):
```bash
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:dev"
```

**5. Access services:**
- **Web App**: http://localhost:3000
- **PgAdmin**: http://localhost:5050 (admin@aiwhisperers.local / admin)
- **Redis Commander**: http://localhost:8081

---

## 🏗️ Docker Architecture (Phase 5)

### Services Overview

```
┌─────────────────────────────────────────────────────┐
│  Docker Compose Stack                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐         ┌──────────────┐         │
│  │     Web     │────────▶│  PostgreSQL  │         │
│  │  (Next.js)  │         │      16      │         │
│  │  Port 3000  │◀────────│   Port 5432  │         │
│  └──────┬──────┘         └──────────────┘         │
│         │                                          │
│         │                ┌──────────────┐         │
│         └───────────────▶│    Redis     │         │
│                          │      7       │         │
│                          │   Port 6379  │         │
│                          └──────────────┘         │
│                                                     │
│  Development Mode Only:                            │
│  ┌─────────────┐         ┌──────────────┐         │
│  │   PgAdmin   │────────▶│  PostgreSQL  │         │
│  │  Port 5050  │         │              │         │
│  └─────────────┘         └──────────────┘         │
│                                                     │
│  ┌─────────────┐         ┌──────────────┐         │
│  │    Redis    │────────▶│    Redis     │         │
│  │  Commander  │         │              │         │
│  │  Port 8081  │         └──────────────┘         │
│  └─────────────┘                                   │
└─────────────────────────────────────────────────────┘
```

### Service Details

| Service | Image | Port | Purpose | Profiles |
|---------|-------|------|---------|----------|
| **web** | Next.js (root Dockerfile) | 3000/3001 | Hybrid app (frontend + backend API) | All |
| **postgres** | postgres:16-alpine | 5432 | Database | All |
| **redis** | redis:7-alpine | 6379 | Cache & rate limiting | All |
| **pgadmin** | dpage/pgadmin4 | 5050 | Database management UI | Dev only |
| **redis-commander** | redis-commander | 8081 | Cache inspection UI | Dev only |

---

## 🔧 Usage Modes

### Development Mode (Recommended)
**Features:** Hot-reload, source mounting, management UIs

```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Or run in background:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View logs:
docker-compose logs -f web
```

**Services:**
- ✅ Web app with hot-reload (< 2 second updates)
- ✅ PostgreSQL 16 with persistent data
- ✅ Redis 7 for caching
- ✅ PgAdmin for database management
- ✅ Redis Commander for cache inspection

### Production Mode (Testing)
**Features:** Optimized build, no hot-reload, production-like

```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# Access at port 3001 (to avoid dev mode conflict)
```

**Use cases:**
- Test production build locally
- Verify environment variables
- Debug production-only issues
- Smoke test before deploying to Render

---

## 🗄️ Database Management

### PgAdmin (Web UI)
**Access:** http://localhost:5050 (dev mode only)
**Credentials:** admin@aiwhisperers.local / admin

**First-time setup:**
1. Open PgAdmin → Register → Server
2. Configure:
   - Host: `postgres`
   - Port: `5432`
   - Username: `aiwhisperers`
   - Password: `aiwhisperers_dev`

### PostgreSQL CLI
```bash
# Connect to database
docker-compose exec postgres psql -U aiwhisperers -d aiwhisperers

# Backup database
docker-compose exec postgres pg_dump -U aiwhisperers aiwhisperers > backup.sql

# Restore database
docker-compose exec -T postgres psql -U aiwhisperers aiwhisperers < backup.sql
```

### Prisma Commands
```bash
# Generate Prisma client
docker-compose exec web sh -c "cd packages/database && pnpm run generate"

# Run migrations
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:dev"

# Open Prisma Studio
docker-compose exec web sh -c "cd packages/database && pnpm run studio"
# Access at: http://localhost:5555
```

---

## 📦 Redis Management

### Redis Commander (Web UI)
**Access:** http://localhost:8081 (dev mode only)

### Redis CLI
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Common commands:
KEYS *              # List all keys
GET key_name        # Get value
DEL key_name        # Delete key
FLUSHALL            # Clear all data (caution!)
```

---

## 🐛 Troubleshooting

### Port Already in Use
**Error:** `Bind for 0.0.0.0:3000 failed`

**Solution:** Change ports in `.env.local`:
```bash
WEB_PORT=3001
POSTGRES_PORT=5433
REDIS_PORT=6380
```

### Database Connection Refused
**Solution:** Wait for health check (10-20 seconds):
```bash
docker-compose ps  # Check if postgres shows "healthy"
docker-compose logs postgres  # Check database logs
```

### Hot-Reload Not Working
**Solution:** Verify development mode:
```bash
# Ensure using docker-compose.dev.yml
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Check environment:
docker-compose exec web printenv | grep CHOKIDAR
# Should show: CHOKIDAR_USEPOLLING=true
```

### Build Cache Issues
**Solution:** Rebuild without cache:
```bash
docker-compose build --no-cache web
docker-compose up
```

### Out of Disk Space
**Solution:** Clean Docker resources:
```bash
docker system prune -a      # Remove unused images
docker volume prune         # Remove unused volumes
```

---

## 🔄 Common Commands

### Service Control
```bash
# Start services (foreground)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Start services (background)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Stop services (keep data)
docker-compose down

# Stop services (delete data)
docker-compose down -v

# Restart specific service
docker-compose restart web

# View logs
docker-compose logs -f web
docker-compose logs --tail=100 postgres
```

### Database Operations
```bash
# Run migrations
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:dev"

# Reset database (caution - deletes all data)
docker-compose down -v postgres
docker-compose up -d postgres

# Backup database
docker-compose exec postgres pg_dump -U aiwhisperers aiwhisperers > backup_$(date +%Y%m%d).sql
```

### Development Workflow
```bash
# Rebuild after package.json changes
docker-compose build web
docker-compose up

# Execute commands in web container
docker-compose exec web sh
docker-compose exec web pnpm --filter web typecheck
docker-compose exec web pnpm --filter web lint
```

---

## 📊 Performance & Optimization

### Image Sizes
- **Web (production):** ~200MB (Alpine + Next.js)
- **PostgreSQL:** ~250MB (Alpine)
- **Redis:** ~50MB (Alpine)

### Build Speed
- **First build:** 5-10 minutes (downloads images)
- **Subsequent builds:** 30-60 seconds (cached layers)
- **Incremental changes:** < 10 seconds (cached dependencies)

### Resource Usage
- **Minimum:** 2GB RAM, 10GB disk
- **Recommended:** 4GB RAM, 20GB disk
- **Production:** 512MB RAM per container

---

## 🔐 Security Best Practices

✅ **Non-root user:** Web app runs as `nextjs` user (UID 1001)
✅ **Environment isolation:** Each service in its own container
✅ **Network isolation:** Bridge network with service names
✅ **Secrets management:** Environment variables (not in images)
✅ **Health checks:** Automatic container health monitoring
✅ **Volume permissions:** Proper ownership and permissions

**Security checklist:**
```bash
# Generate strong secrets
openssl rand -base64 32

# Never commit .env.local
# Always use .env.example as template
# Rotate secrets regularly
# Use HTTPS in production (handled by Render)
```

---

## 🚢 Deploy-Local Parity

### What Matches Render.com

✅ **Same Dockerfile:** Uses root `Dockerfile` (identical to Render)
✅ **Same Node version:** 22.16.0
✅ **Same PostgreSQL:** Version 16
✅ **Same architecture:** Hybrid Next.js (frontend + backend API)
✅ **Same health check:** `/api/health` endpoint
✅ **Same environment:** Production-like configuration

### What's Different (By Design)

- **Database:** Local PostgreSQL vs. Render's managed PostgreSQL
- **Redis:** Local Redis vs. not yet on Render (planned)
- **Management UIs:** Available locally (PgAdmin, Redis Commander)
- **Port:** 3000 local vs. 10000 on Render (auto-mapped)

---

## 📚 Additional Resources

### Documentation
- **Comprehensive Guide:** [docker/README.md](docker/README.md) (500+ lines)
- **Phase 5 Plan:** [local-reports/local-docs/07-phase-5-revised-implementation-plan.md](local-reports/local-docs/07-phase-5-revised-implementation-plan.md)
- **Docker Analysis:** [local-reports/local-docs/06-docker-infrastructure-analysis.md](local-reports/local-docs/06-docker-infrastructure-analysis.md)

### External Links
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)

---

## 🤝 Contributing

When modifying Docker configuration:

1. **Test locally:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

2. **Test production mode:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
   ```

3. **Validate configuration:**
   ```bash
   docker-compose config
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml config
   ```

4. **Update documentation:**
   - Update this file (DOCKER.md)
   - Update docker/README.md if needed
   - Update .env.docker.example with new variables

---

## 📝 Changelog

### **v2.0.0** - Phase 5 Complete (2025-10-10)
- **New:** Comprehensive Docker Compose infrastructure
- **Added:** PostgreSQL 16 service
- **Added:** Redis 7 service
- **Added:** PgAdmin (database management UI)
- **Added:** Redis Commander (cache management UI)
- **Added:** Development and production profiles
- **Added:** Health checks for all services
- **Improved:** Deploy-local parity with Render
- **Documentation:** 500+ lines of comprehensive guides

### **v1.0.0** - Initial Docker Setup
- Multi-stage Dockerfile with Node 22.16.0
- Basic Docker Compose configuration
- Health checks and security hardening
- Development parity with Render deployment

---

## ❓ FAQ

**Q: Why two docker-compose files?**
A: Separation of concerns - base config + environment-specific overrides. Docker best practice.

**Q: Can I use this for production deployment?**
A: No - this is for local development only. Production uses Render.com.

**Q: Do I need to rebuild after code changes?**
A: In dev mode: No (hot-reload). In prod mode: Yes (rebuild required).

**Q: How is this different from `pnpm dev` locally?**
A: Docker provides full environment parity (database, redis, networking). Local `pnpm dev` requires manual PostgreSQL and Redis setup.

---

**Questions?** Check [docker/README.md](docker/README.md) or open an issue on GitHub.

---

**Last Updated:** 2025-10-10 (Phase 5 Complete)
**Version:** 2.0.0
**Status:** ✅ Production-ready local development environment
