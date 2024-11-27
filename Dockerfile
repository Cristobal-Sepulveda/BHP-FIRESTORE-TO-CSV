# Use an official Node.js runtime as a parent image
FROM node:20-alpine
# Set the working directory to /app
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install app dependencies
RUN npm install
# Copy the rest of the application files to the working directory
COPY . .
# Set the PORT environment variable
ENV PORT=8080
# Expose the port the app runs on
EXPOSE 8080
# Start the app
CMD ["npm", "run", "gcpProd"]