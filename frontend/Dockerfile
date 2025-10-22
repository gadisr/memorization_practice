# Use Node.js image to compile TypeScript, then switch to Python for serving
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and tsconfig
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY src/ ./src/

# Compile TypeScript
RUN npm run build

# Use Python 3.12 slim image for serving static files
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy the serve.py script
COPY serve.py ./

# Copy the compiled JavaScript from the builder stage
COPY --from=builder /app/dist ./dist

# Copy public directory if it exists
COPY public/ ./public/

# Install any Python dependencies if needed
# (The serve.py script uses only standard library modules)

# Expose port 3000 (matching the serve.py configuration)
EXPOSE 3000

# Set the command to run the development server
CMD ["python3", "serve.py"]
