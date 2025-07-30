# Use official Node.js image as base
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose port 4200 for Angular dev server
EXPOSE 4200

# Start Angular dev server, listen on all interfaces for Docker
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
