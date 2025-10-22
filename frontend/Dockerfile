# Use Python 3.12 slim image for serving static files
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy the entire project to the container
COPY . /app

# Install any Python dependencies if needed
# (The serve.py script uses only standard library modules)

# Expose port 3000 (matching the serve.py configuration)
EXPOSE 3000

# Set the command to run the development server
CMD ["python3", "serve.py"]
