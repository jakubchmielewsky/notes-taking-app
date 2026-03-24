FROM node:24

WORKDIR /app

COPY package*.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY services/api/package*.json ./services/api/
#COPY services/frontend/package*.json ./services/frontend/

RUN npm install

COPY packages/shared-types/ ./packages/shared-types/
RUN npm run build --workspace=packages/shared-types

COPY services/api/ ./services/api/
RUN npm run build --workspace=services/api

EXPOSE 3000

CMD ["node", "services/api/dist/server.js"]
