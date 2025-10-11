# 🐳 Docker Setup - AI Whisperers Platform

Complete Docker Compose setup for local development with deploy-local parity.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Mode](#development-mode)
- [Production Mode](#production-mode)
- [Database Management](#database-management)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

---

## Prerequisites

### Required
- **Docker Desktop** 4.25+ (includes docker-compose)
  - Windows: https://docs.docker.com/desktop/install/windows-install/
  - Mac: https://docs.docker.com/desktop/install/mac-install/
  - Linux: https://docs.docker.com/desktop/install/linux-install/

### Optional (for non-Docker development)
- **Node.js** 22.16.0+
- **pnpm** 10.18.2+

### Verify Installation
```bash
docker --version          # Should show 24.0+
docker-compose --version  # Should show 2.20+
```

---

## Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp docker/.env.docker.example .env.local

# Edit .env.local with your values (minimum: NEXTAUTH_SECRET)
# Generate secret: openssl rand -base64 32
```

**Minimum .env.local:**
```bash
NODE_ENV=development
POSTGRES_PASSWORD=aiwhisperers_dev
NEXTAUTH_SECRET=your-generated-32-character-secret-here
```

### 2. Start Development Environment

```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**First run** takes 5-10 minutes (downloads images, builds app).
**Subsequent runs** take 30-60 seconds.

### 3. Access Services

Once healthy (look for "✅ ready" or health check success):

| Service | URL | Credentials |
|---------|-----|-------------|
| **Web App** | http://localhost:3000 | (your auth) |
| **PgAdmin** | http://localhost:5050 | admin@aiwhisperers.local / admin |
| **Redis Commander** | http://localhost:8081 | (none) |

### 4. Run Database Migrations

```bash
# In a new terminal (keep docker-compose running)
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:dev"
```

### 5. Stop Services

```bash
# Ctrl+C to stop, then:
docker-compose down

# Or, to remove data volumes (caution - deletes database):
docker-compose down -v
```

---

## Development Mode

Full-featured development environment with hot-reload and management UIs.

### Start Development

```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**Shortcut:** Add to root package.json:
```json
{
  "scripts": {
    "docker:dev": "cd docker && docker-compose -f docker-compose.yml -f docker-compose.dev.yml up"
  }
}
```

Then: `pnpm docker:dev`

### Features

✅ **Hot-Reload** - Code changes reflect in < 2 seconds
✅ **Source Mounting** - No rebuild needed for code changes
✅ **Database UI** - PgAdmin for schema exploration
✅ **Cache UI** - Redis Commander for cache inspection
✅ **Persistent Data** - Database persists across restarts

### Common Development Commands

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f postgres
```

**Run migrations:**
```bash
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:dev"
```

**Generate Prisma client:**
```bash
docker-compose exec web sh -c "cd packages/database && pnpm run generate"
```

**Open Prisma Studio:**
```bash
docker-compose exec web sh -c "cd packages/database && pnpm run studio"
# Access at: http://localhost:5555
```

**Execute commands in web container:**
```bash
# Open shell
docker-compose exec web sh

# Run pnpm commands
docker-compose exec web pnpm --filter web typecheck
docker-compose exec web pnpm --filter web lint
```

**Rebuild after package.json changes:**
```bash
docker-compose build web
docker-compose up
```

### Development Workflow

1. **Start services** (once per session):
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

2. **Edit code** in your IDE - changes auto-reload

3. **View logs** (optional):
   ```bash
   docker-compose logs -f web
   ```

4. **Stop when done**:
   ```bash
   docker-compose down
   ```

---

## Production Mode

Test production builds locally before deploying to Render.

### Start Production Mode

```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

**Note:** Uses port 3001 to avoid conflict with dev mode (3000).

### Features

✅ **Production Build** - Optimized, minified Next.js
✅ **No Hot-Reload** - Static build like production
✅ **Render Parity** - Matches Render.com deployment
❌ **No Management UIs** - Minimal services only

### Use Cases

- Test production build performance
- Verify environment variables
- Debug production-only issues
- Smoke test before deploying

### Production Workflow

1. **Build production image:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build web
   ```

2. **Start services:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
   ```

3. **Access:** http://localhost:3001

4. **Test critical paths:**
   - Homepage load
   - Authentication flow
   - API routes
   - Database connectivity

5. **Stop:**
   ```bash
   docker-compose down
   ```

---

## Database Management

### PgAdmin (Graphical UI)

**Access:** http://localhost:5050 (dev mode only)
**Credentials:** admin@aiwhisperers.local / admin

**First-time setup:**
1. Open PgAdmin
2. Right-click "Servers" → "Register" → "Server"
3. Configure:
   - **Name:** AI Whisperers Local
   - **Host:** postgres
   - **Port:** 5432
   - **Username:** aiwhisperers
   - **Password:** aiwhisperers_dev
4. Click "Save"

### PostgreSQL CLI

**Connect to database:**
```bash
docker-compose exec postgres psql -U aiwhisperers -d aiwhisperers
```

**Common SQL commands:**
```sql
-- List tables
\dt

-- Describe table
\d users

-- Query
SELECT * FROM users LIMIT 10;

-- Exit
\q
```

### Backup & Restore

**Backup database:**
```bash
docker-compose exec postgres pg_dump -U aiwhisperers aiwhisperers > backup_$(date +%Y%m%d).sql
```

**Restore database:**
```bash
docker-compose exec -T postgres psql -U aiwhisperers aiwhisperers < backup.sql
```

**Reset database** (caution - deletes all data):
```bash
# Remove only database volume
docker-compose down
docker volume rm aiwhisperers-postgres-data
docker-compose up -d postgres

# Wait for healthy, then run migrations
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:dev"
```

### Prisma Commands

**Run migrations:**
```bash
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:dev"
```

**Create migration:**
```bash
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:dev --name your_migration_name"
```

**Reset database (via Prisma):**
```bash
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:reset"
```

**Seed database:**
```bash
# Create seed script first: packages/database/prisma/seed.ts
docker-compose exec web sh -c "cd packages/database && pnpm run db:seed"
```

### Redis Management

**Redis Commander** (Graphical UI):
**Access:** http://localhost:8081 (dev mode only)

**Redis CLI:**
```bash
docker-compose exec redis redis-cli
```

**Common commands:**
```bash
# List all keys
KEYS *

# Get value
GET key_name

# Delete key
DEL key_name

# Flush all data (caution)
FLUSHALL

# Exit
exit
```

---

## Architecture

### Service Communication

```
┌─────────────────────────────────────────────────────────────┐
│  Docker Network (aiwhisperers-network)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐         ┌──────────────┐    ┌──────────┐ │
│  │     Web     │────────▶│  PostgreSQL  │    │  Redis   │ │
│  │  (Next.js)  │         │    (5432)    │    │  (6379)  │ │
│  │  Port 3000  │◀────────│              │◀───│          │ │
│  └──────┬──────┘         └──────┬───────┘    └────┬─────┘ │
│         │                       │                  │       │
│         │                       │                  │       │
│  ┌──────▼─────────────────┐   │                  │       │
│  │      Your Browser      │   │                  │       │
│  │  http://localhost:3000 │   │                  │       │
│  └────────────────────────┘   │                  │       │
│                                │                  │       │
│  ┌────────────────────────┐  ┌▼────────────┐   ┌▼──────────┐
│  │       PgAdmin          │  │  postgres   │   │   redis   │
│  │  http://localhost:5050 │──│   volume    │   │  volume   │
│  └────────────────────────┘  └─────────────┘   └───────────┘
│                                                             │
│  ┌────────────────────────┐                                │
│  │  Redis Commander       │                                │
│  │  http://localhost:8081 │                                │
│  └────────────────────────┘                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Browser** → **Web** (HTTP requests)
2. **Web** → **PostgreSQL** (database queries)
3. **Web** → **Redis** (cache operations)
4. **PgAdmin** → **PostgreSQL** (database management)
5. **Redis Commander** → **Redis** (cache inspection)

### Data Persistence

| Volume | Purpose | Persists? |
|--------|---------|-----------|
| `postgres_data` | Database files | ✅ Yes (unless `-v` flag used) |
| `redis_data` | Cache persistence | ✅ Yes |
| `pgadmin_data` | PgAdmin settings | ✅ Yes |

**Remove all data:**
```bash
docker-compose down -v
```

### Comparison Table

| Feature | Docker Dev | Docker Prod | Render Production |
|---------|-----------|-------------|-------------------|
| **Web Service** | Next.js dev server | Next.js production | Next.js production |
| **Hot-Reload** | ✅ Yes | ❌ No | ❌ No |
| **Database** | Local PostgreSQL 16 | Local PostgreSQL 16 | Managed PostgreSQL 16 |
| **Redis** | Local Redis 7 | Local Redis 7 | ❌ Not yet |
| **Port** | 3000 | 3001 | 10000 |
| **Build** | On-demand | Pre-built | Pre-built |
| **Management UIs** | ✅ PgAdmin, Redis Commander | ❌ None | Render Dashboard |
| **Source Mounting** | ✅ Yes | ❌ No | ❌ No |
| **NODE_ENV** | development | production | production |

---

## Troubleshooting

### Port Already in Use

**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution:** Change ports in `.env.local`:
```bash
WEB_PORT=3001
POSTGRES_PORT=5433
REDIS_PORT=6380
```

**Or stop conflicting service:**
```bash
# Find process using port
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process (use PID from above)
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Database Connection Refused

**Error:** `Error: Can't reach database server at postgres:5432`

**Solutions:**

1. **Wait for health check:**
   ```bash
   docker-compose ps
   # Wait until postgres shows "healthy"
   ```

2. **Check database logs:**
   ```bash
   docker-compose logs postgres
   ```

3. **Restart postgres:**
   ```bash
   docker-compose restart postgres
   ```

4. **Reset database:**
   ```bash
   docker-compose down
   docker volume rm aiwhisperers-postgres-data
   docker-compose up -d
   ```

### Build Cache Issues

**Error:** Old code running after changes

**Solution:** Rebuild without cache:
```bash
docker-compose build --no-cache web
docker-compose up
```

### Hot-Reload Not Working

**Symptoms:** Code changes don't reflect in browser

**Solutions:**

1. **Verify dev mode:**
   ```bash
   # Make sure using docker-compose.dev.yml
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

2. **Check environment:**
   ```bash
   docker-compose exec web printenv | grep CHOKIDAR
   # Should show: CHOKIDAR_USEPOLLING=true
   ```

3. **Increase polling interval:**
   ```bash
   # Add to .env.local
   WATCHPACK_POLLING=true
   ```

4. **Restart web service:**
   ```bash
   docker-compose restart web
   ```

### Permission Errors (Linux)

**Error:** `Permission denied` when mounting volumes

**Solution:** Fix ownership:
```bash
sudo chown -R $USER:$USER .
```

### Out of Disk Space

**Error:** `no space left on device`

**Solutions:**

1. **Clean unused Docker resources:**
   ```bash
   docker system prune -a
   docker volume prune
   ```

2. **Check disk usage:**
   ```bash
   docker system df
   ```

3. **Remove specific volumes:**
   ```bash
   docker volume ls
   docker volume rm <volume_name>
   ```

### Web Service Exits Immediately

**Symptom:** `web exited with code 1`

**Solutions:**

1. **Check web logs:**
   ```bash
   docker-compose logs web
   ```

2. **Common causes:**
   - Missing `NEXTAUTH_SECRET` in `.env.local`
   - Database not healthy yet
   - Syntax error in code
   - Missing dependencies

3. **Debug interactively:**
   ```bash
   docker-compose run --rm web sh
   # Try running commands manually
   ```

---

## FAQ

### Q: Why two docker-compose files?

**A:** Docker best practice - separation of concerns:
- `docker-compose.yml` = Base configuration (shared)
- `docker-compose.dev.yml` = Development overrides (hot-reload, UIs)
- `docker-compose.prod.yml` = Production overrides (optimized build)

This keeps each file focused and prevents duplication.

### Q: Can I use this for production deployment?

**A:** No - this is for **local development only**. Production uses:
- **Render.com** for hosting
- **Root Dockerfile** for deployment
- **Managed PostgreSQL** (not Docker)
- **Render dashboard** for management

This Docker setup **matches** production architecture but runs locally.

### Q: Do I need to rebuild after code changes?

**A:** Depends on mode:
- **Development mode:** ❌ No - hot-reload handles it
- **Production mode:** ✅ Yes - rebuild with `docker-compose build web`

### Q: How is this different from `pnpm dev` locally?

**A:** Full environment parity:

| Aspect | pnpm dev | Docker Dev |
|--------|----------|------------|
| Database | Manual PostgreSQL install | Automated PostgreSQL container |
| Redis | Manual Redis install | Automated Redis container |
| Environment | Manual setup | Automated setup |
| Networking | localhost connections | Docker network |
| Isolation | System-level | Container-level |
| Portability | Machine-dependent | Runs anywhere |

**Use Docker when:**
- ✅ You want full production parity
- ✅ You're onboarding a new developer
- ✅ You need isolated environment
- ✅ You're testing database migrations

**Use pnpm dev when:**
- ✅ You have local services already
- ✅ You want fastest possible startup
- ✅ You're doing quick frontend changes

### Q: What about the root Dockerfile?

**A:** It's used by **both**:
- **Render.com:** Builds and deploys production
- **Docker Compose:** Reuses same Dockerfile for consistency

This ensures **deploy-local parity** - if it works in Docker locally, it works on Render.

### Q: How do I add a new environment variable?

**Steps:**
1. Add to `docker/.env.docker.example` (documentation)
2. Add to `.env.local` (your local value)
3. Add to `docker-compose.yml` `environment` section (if needed by container)
4. Restart: `docker-compose down && docker-compose up`

### Q: Can I run dev and prod modes simultaneously?

**A:** Yes - they use different ports:
```bash
# Terminal 1 - Development (port 3000)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Terminal 2 - Production (port 3001)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### Q: How do I view all running containers?

**A:**
```bash
docker-compose ps
```

---

## Quick Reference

### Essential Commands

```bash
# Development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# Stop services (keep data)
docker-compose down

# Stop services (delete data)
docker-compose down -v

# View logs
docker-compose logs -f web

# Run migrations
docker-compose exec web sh -c "cd packages/database && pnpm run migrate:dev"

# Open shell
docker-compose exec web sh

# Rebuild
docker-compose build --no-cache web
```

### Service URLs

- **Web App:** http://localhost:3000
- **PgAdmin:** http://localhost:5050
- **Redis Commander:** http://localhost:8081
- **Prisma Studio:** http://localhost:5555 (after running `pnpm run studio`)

---

## Support

**Issues:** Report at https://github.com/anthropics/claude-code/issues
**Documentation:** See `local-reports/local-docs/`
**Phase 5 Plan:** See `local-reports/local-docs/07-phase-5-revised-implementation-plan.md`

---

**Last Updated:** 2025-10-10
**Version:** 1.0.0
**Phase:** 5 (Docker Compose Parity)
