# Use the official Node.js 18 image as a base
FROM node:18-alpine

# Create app directory and set ownership
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

# Set the working directory
WORKDIR /home/node/app

# Copy package.json and package-lock.json files
COPY project_src/package*.json ./

# Install dependencies as root user
RUN npm install

# Switch to non-root user
USER node

# Copy the rest of the application code
COPY --chown=node:node project_src/ /home/node/app/

# Expose the application port
EXPOSE 80

# Start the application
CMD ["node", "app.js"]