# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application source
COPY src/ ./src/

# ---------- Production stage ----------
FROM node:20-alpine

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY package.json ./

# Install PM2 globally
RUN npm install -g pm2

# Create data directory for SQLite and set permissions
RUN mkdir -p /app/data && chown -R appuser:appgroup /app

ENV NODE_ENV=production
ENV PORT=80

USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/api/products || exit 1

CMD ["pm2-runtime", "src/index.js"]
