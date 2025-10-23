#!/bin/bash

# Quick HTTPS Development Setup
# This script sets up HTTPS for development/testing with self-signed certificates

set -e

echo "🚀 Starting HTTPS Development Environment"
echo "=========================================="
echo ""

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Generate self-signed certificate for development
echo "🔒 Generating self-signed SSL certificate for development..."
openssl req -x509 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes \
    -subj "/C=US/ST=State/L=City/O=BlindfoldCubing/CN=blindfoldcubing.com" 2>/dev/null

echo "✅ Self-signed certificate generated"
echo ""

# Set proper permissions
chmod 644 ssl/cert.pem
chmod 600 ssl/key.pem

echo "🐳 Starting Docker services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "🧪 Testing deployment..."

# Test HTTPS endpoint
if curl -k -s -o /dev/null -w "%{http_code}" https://blindfoldcubing.com/health 2>/dev/null | grep -q "200"; then
    echo "✅ HTTPS health check successful"
else
    echo "⚠️  HTTPS health check failed (services may still be starting)"
fi

# Test HTTP redirect
if curl -s -o /dev/null -w "%{http_code}" http://blindfoldcubing.com/health 2>/dev/null | grep -q "301\|302"; then
    echo "✅ HTTP to HTTPS redirect working"
else
    echo "⚠️  HTTP redirect not working"
fi

echo ""
echo "🎉 HTTPS Development Environment Ready!"
echo "======================================"
echo ""
echo "Your application is now available at:"
echo "  🔒 HTTPS: https://blindfoldcubing.com"
echo "  🔄 HTTP:  http://blindfoldcubing.com (redirects to HTTPS)"
echo ""
echo "⚠️  Note: You'll see a security warning in your browser because"
echo "   this uses a self-signed certificate. Click 'Advanced' and"
echo "   'Proceed to blindfoldcubing.com' to continue."
echo ""
echo "📊 Service Status:"
docker-compose ps
echo ""
echo "📝 Useful commands:"
echo "  View logs:     docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart:       docker-compose restart"
echo ""
echo "🔧 For production deployment, see HTTPS_DEPLOYMENT.md"
