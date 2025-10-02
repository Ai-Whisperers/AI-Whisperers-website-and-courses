# Multi-stage Dockerfile for AI Whisperers Website
# Mirrors Render deployment environment for local development parity

# Stage 1: Dependencies
FROM node:22.16.0-alpine AS deps
WORKDIR /app

# Install dependencies for node-gyp (required for some native modules)
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (including devDependencies needed for build)
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Stage 2: Builder
FROM node:22.16.0-alpine AS builder
WORKDIR /app

# Install dependencies for build
RUN apk add --no-cache libc6-compat python3 make g++ openssl

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Provide placeholder DATABASE_URL for Prisma generation
# Real DATABASE_URL will be set at runtime via environment variables
ARG DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder?schema=public"
ENV DATABASE_URL=$DATABASE_URL

# Build the application (runs: compile-content && prisma generate && next build)
# Uses build:docker script which doesn't run npm install again
RUN npm run build:docker

# Stage 3: Runner (Production)
FROM node:22.16.0-alpine AS runner
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src/content ./src/content
COPY --from=builder /app/src/lib/content/compiled ./src/lib/content/compiled
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma ./prisma

# Set ownership to nextjs user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port (Render uses 10000 by default, Docker can map any port)
EXPOSE 3000

# Set PORT environment variable (Render will override this with PORT=10000)
ENV PORT=3000

# Health check (uses PORT env var if available)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "const port=process.env.PORT||3000; require('http').get(\`http://localhost:\${port}/api/health\`, (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application (server.js is copied to /app/ from .next/standalone/)
CMD ["node", "server.js"]
