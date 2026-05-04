# Use a lightweight Node.js base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the package files first to cache dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose the port your server runs on
EXPOSE 8000

# Start the server using node (we don't use nodemon in production)
CMD ["node", "app.js"]
