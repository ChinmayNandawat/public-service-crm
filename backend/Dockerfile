FROM node:18-alpine

# Install build dependencies for bcrypt
RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
