FROM node:20-alpine AS builder

WORKDIR /app

# Instalar TypeScript y Vite globalmente
RUN npm install -g typescript vite

COPY package*.json ./
RUN npm ci

COPY . .

# Build con las variables de entorno
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN tsc -b && vite build

FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


