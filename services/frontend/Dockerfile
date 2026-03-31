# Stage 1: Build
FROM node:24 AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY services/frontend/package*.json ./services/frontend/

RUN npm install

COPY packages/shared-types/ ./packages/shared-types/
RUN npm run build --workspace=packages/shared-types

COPY services/frontend/ ./services/frontend/
RUN npm run build --workspace=services/frontend

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/services/frontend/dist /usr/share/nginx/html
COPY services/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
