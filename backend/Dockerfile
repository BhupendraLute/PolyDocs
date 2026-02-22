# Build stage
FROM node:20-alpine AS build

# Install build dependencies
RUN apk add --no-cache git

WORKDIR /app

# Copy root lockfile and workspace package.json
COPY package*.json ./
COPY backend/package*.json ./backend/

# Force install and explicitly add the missing platform binary for Rollup/Vite
RUN npm install -w @polydocs/backend && \
    npm install @rollup/rollup-linux-x64-musl

# Copy backend source
COPY backend/ ./backend/

# Build backend
RUN npm run build -w @polydocs/backend

# Production stage
FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /app

# Copy root lockfile and workspace package.json
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install production-only dependencies
RUN npm install -w @polydocs/backend --omit=dev

# Copy build artifacts
COPY --from=build /app/backend/dist ./backend/dist

# Security: Run as non-root user
USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3001/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "backend/dist/index.js"]
