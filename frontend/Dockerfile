# Use node base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the files
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
