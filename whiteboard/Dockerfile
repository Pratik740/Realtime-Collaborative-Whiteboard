# Stage 1: Build the React/Vite app
FROM node:22-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# This generates the static files in the /app/dist folder
RUN npm run build 

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built files from Stage 1 into Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Replace the default Nginx config with our custom proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
