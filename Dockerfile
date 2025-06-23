# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app .

# Environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
