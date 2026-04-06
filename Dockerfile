FROM node:20-alpine AS builder

WORKDIR /app

# Instalar TypeScript y Vite globalmente
RUN npm install -g typescript vite

COPY package*.json ./
RUN npm ci

COPY . .

# Las variables de entorno de Railway se inyectan automáticamente
# durante el build si están configuradas en el servicio
RUN export VITE_SUPABASE_URL=$(echo $VITE_SUPABASE_URL) && \
    export VITE_SUPABASE_ANON_KEY=$(echo $VITE_SUPABASE_ANON_KEY) && \
    tsc -b && vite build

FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



