# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build Vite app
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Cloud Run expects the app to listen on PORT env variable
ENV PORT=8080

EXPOSE 8080

# Serve the static files
CMD ["serve", "-s", "dist", "-l", "8080", "--no-clipboard"]
