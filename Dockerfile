FROM node:20-alpine AS builder

WORKDIR /app

# Instalar TypeScript y Vite globalmente
RUN npm install -g typescript vite

COPY package*.json ./
RUN npm ci

COPY . .

# Crear archivo .env con las variables
RUN echo "VITE_SUPABASE_URL=https://quvujnzocydyhnvvomek.supabase.co" > .env && \
    echo "VITE_SUPABASE_ANON_KEY=sb_publishable_t97p9B4nwR-5XkADWJgMCg_sQ9zz-GC" >> .env

RUN tsc -b && vite build

FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




