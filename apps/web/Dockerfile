# Dockerfile for web (SPA) built from root context
FROM oven/bun:1.2.18-slim AS builder

WORKDIR /app

# Copy root and workspace package files for caching
COPY package.json bun.lock* turbo.json tsconfig.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN bun install --frozen-lockfile --ignore-scripts

# Copy shared configs and source files
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
COPY .env* ./

# Run database schema generation using mock DB URL
RUN DATABASE_URL=postgresql://mock:mock@localhost:5432/mock bunx prisma generate --schema packages/db/prisma/schema

# Declare build-time environment variables
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

# Build web application
RUN bun run build --filter=web

# Production stage with nginx
FROM nginx:alpine AS runner

# Copy nginx configuration for SPA routing
RUN echo 'server { \
    listen 3000; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
