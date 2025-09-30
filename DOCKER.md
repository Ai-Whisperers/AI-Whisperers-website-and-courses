# 🐳 Docker Setup Guide

Complete Docker configuration for the AI Whisperers Website, providing development parity with Render deployment environment.

---

## 📋 **Prerequisites**

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- `.env` file with required environment variables (see `.env.example`)

---

## 🚀 **Quick Start**

### **Production Build (Mirrors Render Deployment)**

```bash
# Build and run production container
docker-compose up app

# Or run in detached mode
docker-compose up -d app

# View logs
docker-compose logs -f app

# Stop container
docker-compose down
```

The app will be available at: **http://localhost:3000**

### **Development Mode (Hot Reload)**

```bash
# Run development server with hot reload
docker-compose --profile dev up dev

# Or in detached mode
docker-compose --profile dev up -d dev

# Access at http://localhost:3001
```

---

## 🏗️ **Docker Architecture**

### **Multi-Stage Build Process**

The `Dockerfile` uses a 3-stage build for optimization:

1. **Stage 1 (deps):** Install production dependencies
2. **Stage 2 (builder):** Build the Next.js application
3. **Stage 3 (runner):** Production runtime image

### **Key Features**

- ✅ **Node.js v22.16.0** - Matches Render deployment
- ✅ **Multi-stage build** - Optimized image size (~200MB)
- ✅ **Non-root user** - Security best practice
- ✅ **Health checks** - Container health monitoring
- ✅ **Alpine Linux** - Minimal base image

---

## 🔧 **Commands Reference**

### **Build Commands**

```bash
# Build production image
docker-compose build app

# Build without cache (fresh build)
docker-compose build --no-cache app

# Build specific stage
docker build --target builder -t ai-whisperers:builder .
```

### **Run Commands**

```bash
# Start production container
docker-compose up app

# Start development container
docker-compose --profile dev up dev

# Run in background
docker-compose up -d app

# View running containers
docker-compose ps

# View logs
docker-compose logs -f app

# Execute command in running container
docker-compose exec app npm run lint
docker-compose exec app sh
```

### **Stop & Clean Commands**

```bash
# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a --volumes
```

---

## 🌍 **Environment Variables**

Create a `.env` file in the project root:

```env
# Node Environment
NODE_ENV=production
PORT=3000

# Next.js
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Authentication (NextAuth)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# AI APIs (Optional)
ANTHROPIC_API_KEY=your-key-here
OPENAI_API_KEY=your-key-here
```

**Security Note:** Never commit `.env` files to version control!

---

## 🔍 **Health Checks**

The container includes automatic health monitoring:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' ai-whisperers-app

# View health check logs
docker inspect --format='{{json .State.Health}}' ai-whisperers-app | jq
```

Health check endpoint: `/api/health`

---

## 🐛 **Troubleshooting**

### **Build Fails**

```bash
# Clear Docker cache and rebuild
docker-compose down -v
docker system prune -a
docker-compose build --no-cache app
```

### **Port Already in Use**

```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use different local port
```

### **Permission Issues**

```bash
# Ensure .env has correct permissions
chmod 644 .env

# Fix file ownership (if needed)
sudo chown -R $USER:$USER .
```

### **Container Won't Start**

```bash
# Check logs for errors
docker-compose logs app

# Inspect container
docker inspect ai-whisperers-app

# Run interactive shell for debugging
docker-compose run --rm app sh
```

---

## 📊 **Performance Optimization**

### **Image Size**

Current image size: ~200MB (Alpine + Next.js)

```bash
# Check image size
docker images ai-whisperers-website-and-courses
```

### **Build Speed**

- **Layer caching:** Dependencies cached unless `package.json` changes
- **Multi-stage build:** Only production artifacts in final image
- **.dockerignore:** Excludes unnecessary files

### **Production Optimizations**

```bash
# Run with resource limits
docker-compose up app --scale app=1 \
  --memory="512m" \
  --cpus="1.0"
```

---

## 🔐 **Security Best Practices**

✅ **Non-root user:** App runs as `nextjs` user (UID 1001)
✅ **Read-only filesystem:** Consider adding `read_only: true` to compose
✅ **No secrets in image:** Environment variables loaded at runtime
✅ **Minimal base:** Alpine Linux reduces attack surface
✅ **Security scanning:** Run `docker scan ai-whisperers-website-and-courses`

---

## 🚢 **Deployment**

### **Render Deployment**

The Docker configuration mirrors Render's environment:

- **Node Version:** 22.16.0
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Port:** 10000 (on Render), 3000 (local)

### **Build for Render**

```bash
# Test Render-like build locally
docker build \
  --build-arg NODE_ENV=production \
  -t ai-whisperers:render \
  .

docker run -p 10000:3000 ai-whisperers:render
```

---

## 📚 **Additional Resources**

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [Alpine Linux Packages](https://pkgs.alpinelinux.org/packages)

---

## 🤝 **Contributing**

When modifying Docker configuration:

1. Test builds locally: `docker-compose build`
2. Verify production mode: `docker-compose up app`
3. Check image size: `docker images`
4. Update this documentation
5. Test on different platforms (Windows/Mac/Linux)

---

## 📝 **Changelog**

### **v1.0.0** - Initial Docker Setup
- Multi-stage Dockerfile with Node 22.16.0
- Docker Compose for production and development
- Health checks and security hardening
- Development parity with Render deployment

---

**Questions?** Check the main `README.md` or open an issue on GitHub.
