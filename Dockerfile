# Etapa 1: Construcción
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copiar el resto del código y construir la aplicación
COPY . .
# Vite incorpora esta URL pública al bundle; no es una variable de runtime.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN test -n "$VITE_API_URL" || (echo "Falta el build arg VITE_API_URL (URL publica del backend)" >&2; exit 1)
RUN npm run build

# Etapa 2: Servidor de producción
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]