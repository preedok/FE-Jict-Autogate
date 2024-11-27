# Stage 1 - the build process
FROM node:20.10-alpine as build
WORKDIR /usr/app

# Copy package files and install dependencies
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the entire project and build based on the environment
COPY . ./
ARG DEPLOY_ENV
COPY .env.template .env
RUN if [[ "$DEPLOY_ENV" == *"production"* ]]; then yarn run build:production; else yarn run build:staging; fi

# Stage 2 - the production environment
FROM nginx:stable-alpine

# Copy the built files from the build stage
COPY --from=build /usr/app/dist /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx with the default configuration
CMD ["nginx", "-g", "daemon off;"]