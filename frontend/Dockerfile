# Stage 1: Build the Angular application
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

#### install angular cli
RUN npm install -g @angular/cli

# Install ALL dependencies (including devDependencies for Angular CLI)
RUN npm i

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
