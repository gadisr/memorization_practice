#!/bin/sh
set -e

SSL_DIR="/etc/nginx/ssl"
CERT_FILE="$SSL_DIR/cert.pem"
KEY_FILE="$SSL_DIR/key.pem"

# Create SSL directory if it doesn't exist
mkdir -p "$SSL_DIR"

# Generate self-signed certificate if certificates don't exist
if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
    echo "SSL certificates not found. Generating self-signed certificates..."
    
    # Generate private key
    openssl genrsa -out "$KEY_FILE" 2048
    
    # Generate certificate (valid for 365 days)
    openssl req -new -x509 -key "$KEY_FILE" -out "$CERT_FILE" -days 365 \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=blindfoldcubing.com" \
        -addext "subjectAltName=DNS:blindfoldcubing.com,DNS:www.blindfoldcubing.com"
    
    # Set proper permissions
    chmod 600 "$KEY_FILE"
    chmod 644 "$CERT_FILE"
    
    echo "Self-signed SSL certificate generated."
    echo "For production, mount real certificates from Let's Encrypt or your CA."
else
    echo "SSL certificates found. Using mounted certificates."
fi

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

# Start nginx
echo "Starting nginx..."
exec nginx -g "daemon off;"

