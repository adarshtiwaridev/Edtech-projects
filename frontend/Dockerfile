# Frontend Production Dockerfile for Kodemates EdTech React 18 SPA (Nginx multi-stage build)
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve static production assets via Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP web port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
