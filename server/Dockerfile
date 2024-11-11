# Use the official Node.js image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code to the working directory
COPY . .

# Build the TypeScript code if necessary
RUN npm run build

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
