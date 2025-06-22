# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Stage 2: Run
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 8080 8000
HEALTHCHECK --interval=30s --timeout=300s --start-period=5s --retries=3 CMD node healthcheck.js
CMD ["node", "--enable-source-maps", "index.js"]
