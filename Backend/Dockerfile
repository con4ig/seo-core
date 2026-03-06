# Build Stage
FROM node:20-alpine AS build
# Increase memory limit for Strapi build
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev
WORKDIR /opt/app
COPY Backend/package*.json ./
# Copy only the pre-built plugin artifacts (not source!)
COPY strapi-plugin-seo-gemini/dist/ ./strapi-plugin-seo-gemini/dist/
COPY strapi-plugin-seo-gemini/package.json ./strapi-plugin-seo-gemini/package.json
RUN npm install
COPY Backend/ .
RUN npm run build

# Runtime Stage
FROM node:20-alpine
RUN apk add --no-cache libpng vips-dev
WORKDIR /opt/app
COPY --from=build /opt/app ./

EXPOSE 1337
CMD ["npm", "run", "start"]
