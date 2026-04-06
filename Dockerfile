FROM node:20-alpine AS builder

WORKDIR /app

# Instalar TypeScript y Vite globalmente
RUN npm install -g typescript vite

COPY package*.json ./
RUN npm ci

COPY . .

# Build usando los binarios globales
RUN tsc -b && vite build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
