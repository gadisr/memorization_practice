#!/bin/bash

# Production SSL Certificate Setup Script
# This script helps you set up SSL certificates for production deployment

set -e

SSL_DIR="./ssl"
CERT_FILE="$SSL_DIR/cert.pem"
KEY_FILE="$SSL_DIR/key.pem"
DOMAIN=""

echo "🔒 Production SSL Certificate Setup"
echo "=================================="
echo ""

# Check if domain is provided as argument
if [ $# -eq 1 ]; then
    DOMAIN=$1
    echo "Using domain: $DOMAIN"
else
    echo "Usage: $0 <domain>"
    echo "Example: $0 blindfoldcubing.com"
    echo ""
    echo "This script will help you set up SSL certificates for your domain."
    echo "You have several options:"
    echo ""
    echo "1. Let's Encrypt (recommended for production)"
    echo "2. Self-signed certificate (for testing)"
    echo "3. Custom certificate (if you have your own)"
    echo ""
    exit 1
fi

# Create SSL directory
mkdir -p "$SSL_DIR"

echo "Setting up SSL certificates for domain: $DOMAIN"
echo ""

# Check if certbot is available
if command -v certbot &> /dev/null; then
    echo "✅ Certbot found. Setting up Let's Encrypt certificate..."
    echo ""
    
    # Stop any running containers that might be using port 80/443
    echo "⚠️  Please ensure no services are running on ports 80 and 443"
    echo "   You may need to stop your current deployment first:"
    echo "   docker-compose down"
    echo ""
    read -p "Press Enter to continue with Let's Encrypt setup..."
    
    # Generate Let's Encrypt certificate
    certbot certonly --standalone -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN
    
    # Copy certificates to our SSL directory
    cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$CERT_FILE"
    cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$KEY_FILE"
    
    echo "✅ Let's Encrypt certificate installed successfully!"
    echo "   Certificate: $CERT_FILE"
    echo "   Private Key: $KEY_FILE"
    echo ""
    echo "📝 Note: Let's Encrypt certificates expire every 90 days."
    echo "   Set up automatic renewal with:"
    echo "   echo '0 12 * * * /usr/bin/certbot renew --quiet' | crontab -"
    
elif [ "$1" = "--self-signed" ]; then
    echo "🔧 Generating self-signed certificate for testing..."
    echo ""
    
    # Generate self-signed certificate
    openssl req -x509 -newkey rsa:4096 -keyout "$KEY_FILE" -out "$CERT_FILE" -days 365 -nodes \
        -subj "/C=US/ST=State/L=City/O=BlindfoldCubing/CN=$DOMAIN"
    
    echo "✅ Self-signed certificate generated!"
    echo "   Certificate: $CERT_FILE"
    echo "   Private Key: $KEY_FILE"
    echo "   Valid for: 365 days"
    echo ""
    echo "⚠️  Warning: Self-signed certificates will show security warnings in browsers."
    echo "   Use only for testing or development."
    
else
    echo "❌ Certbot not found. Please install certbot for Let's Encrypt certificates:"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt-get update && sudo apt-get install certbot"
    echo ""
    echo "CentOS/RHEL:"
    echo "  sudo yum install certbot"
    echo ""
    echo "Or generate a self-signed certificate for testing:"
    echo "  $0 --self-signed blindfoldcubing.com"
    echo ""
    exit 1
fi

# Set proper permissions
chmod 644 "$CERT_FILE"
chmod 600 "$KEY_FILE"

echo ""
echo "🚀 SSL setup complete! You can now start your HTTPS deployment:"
echo "   docker-compose up -d"
echo ""
echo "Your application will be available at:"
echo "   https://$DOMAIN"
echo ""
