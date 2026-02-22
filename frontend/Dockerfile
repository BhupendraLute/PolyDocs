# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy root lockfile and workspace package.json
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Force install and explicitly add the missing platform binary for Rollup/Vite
RUN npm install -w @polydocs/frontend && \
    npm install @rollup/rollup-linux-x64-musl

# Copy frontend source
COPY frontend/ ./frontend/

# Build frontend
RUN npm run build -w @polydocs/frontend

# Production stage
FROM nginx:alpine

# Copy build artifacts to nginx public directory
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

# Healthcheck for Nginx
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
