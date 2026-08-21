# Backend Production Dockerfile for Kodemates EdTech REST API Service
FROM node:18-alpine

WORKDIR /app

# Install dependencies first for optimal layer caching
COPY package*.json ./
RUN npm ci --only=production

# Copy source application code
COPY . .

# Expose default HTTP port
EXPOSE 5000

ENV NODE_ENV=production

# Start production server
CMD ["node", "src/server.js"]
