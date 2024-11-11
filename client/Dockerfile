# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the frontend port (default for Next.js is 3000)
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "dev"]
