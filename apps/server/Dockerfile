# Dockerfile for judge_system server
# Optimized multi-stage build for Docker deployment

# Build stage
FROM oven/bun:1.2.18-slim AS builder

WORKDIR /app

# Copy lockfile and package definitions for workspace resolving
COPY package.json bun.lock* turbo.json tsconfig.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/config/package.json ./packages/config/

# Install dependencies using Bun cache mounting (ignoring postinstall scripts)
RUN bun install --frozen-lockfile --ignore-scripts

# Copy shared configs and source files
COPY packages/ ./packages/
COPY apps/server/ ./apps/server/

# Run database schema generation using mock DB URL
RUN DATABASE_URL=postgresql://mock:mock@localhost:5432/mock bunx prisma generate --schema packages/db/prisma/schema

# Build the application
RUN bun run build --filter=server

# Production stage
FROM oven/bun:1.2.18-slim AS runner

# Harden runtime: Add non-root system user
RUN addgroup --gid 1001 --system appgroup && \
    adduser --uid 1001 --system --ingroup appgroup appuser

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built workspace and node_modules from builder
COPY --from=builder --chown=appuser:appgroup /app/package.json /app/bun.lock* ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/packages ./packages
COPY --from=builder --chown=appuser:appgroup /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=appuser:appgroup /app/apps/server/package.json ./apps/server/package.json

# Switch to non-root execution
USER 1001

EXPOSE 3000

CMD ["bun", "run", "apps/server/dist/index.mjs"]
