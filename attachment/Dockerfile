# Use the official Node.js image with the latest tag
FROM node:latest

# Install dependencies needed for Google Chrome
RUN apt-get update && apt-get install -y wget gnupg2 ca-certificates && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && apt-get install -y google-chrome-stable

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the app.js file to the container
COPY app.js .

# Expose port 1337 for the server to listen on
EXPOSE 1337

# Start the Node.js server
CMD ["node", "app.js"]
