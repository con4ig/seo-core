# Build Stage
FROM node:20-alpine AS build
# Increase memory limit for Strapi build
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev
WORKDIR /opt/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime Stage
FROM node:20-alpine
RUN apk add --no-cache libpng vips-dev
WORKDIR /opt/app
COPY --from=build /opt/app ./

EXPOSE 1337
CMD ["npm", "run", "start"]