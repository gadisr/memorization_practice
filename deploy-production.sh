#!/bin/bash

# Production Deployment Script
# This script deploys the application for production with managed PostgreSQL

set -e

echo "🚀 Production Deployment for BlindfoldCubing"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if production environment file exists
if [ ! -f "production.env" ]; then
    print_warning "production.env file not found"
    echo "Creating from template..."
    cp production.env.example production.env
    echo ""
    echo "📝 Please edit production.env with your actual values:"
    echo "   - DATABASE_URL: Your managed PostgreSQL connection string"
    echo "   - FIREBASE_PROJECT_ID: Your Firebase project ID"
    echo "   - FIREBASE_CREDENTIALS_PATH: Path to your Firebase credentials"
    echo ""
    echo "Example DATABASE_URL:"
    echo "   postgresql://username:password@your-db-host:5432/database_name"
    echo ""
    read -p "Press Enter after updating production.env..."
fi

# Load production environment variables
if [ -f "production.env" ]; then
    export $(cat production.env | grep -v '^#' | xargs)
    print_status 0 "Production environment variables loaded"
else
    print_status 1 "production.env file not found"
    exit 1
fi

# Validate required environment variables
echo ""
echo "🔍 Validating environment variables..."

if [ -z "$DATABASE_URL" ]; then
    print_status 1 "DATABASE_URL is required"
    exit 1
else
    print_status 0 "DATABASE_URL is set"
fi

if [ -z "$FIREBASE_PROJECT_ID" ]; then
    print_status 1 "FIREBASE_PROJECT_ID is required"
    exit 1
else
    print_status 0 "FIREBASE_PROJECT_ID is set"
fi

if [ -z "$FIREBASE_CREDENTIALS_PATH" ]; then
    print_status 1 "FIREBASE_CREDENTIALS_PATH is required"
    exit 1
else
    print_status 0 "FIREBASE_CREDENTIALS_PATH is set"
fi

# Check if Firebase credentials file exists
if [ ! -f "$FIREBASE_CREDENTIALS_PATH" ]; then
    print_warning "Firebase credentials file not found at: $FIREBASE_CREDENTIALS_PATH"
    echo "Please ensure your Firebase credentials file is in the correct location."
    exit 1
fi

echo ""
echo "🔒 Setting up SSL certificates..."

# Check if SSL certificates exist
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    print_warning "SSL certificates not found"
    echo "Generating SSL certificates..."
    ./ssl/setup-production-ssl.sh blindfoldcubing.com
else
    print_status 0 "SSL certificates found"
fi

echo ""
echo "🐳 Starting production deployment..."

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Start production services (without PostgreSQL)
echo "Starting production services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 15

echo ""
echo "🧪 Testing deployment..."

# Test HTTPS endpoint
if curl -k -s -o /dev/null -w "%{http_code}" https://blindfoldcubing.com/health 2>/dev/null | grep -q "200"; then
    print_status 0 "HTTPS health check successful"
else
    print_warning "HTTPS health check failed (services may still be starting)"
fi

# Test HTTP redirect
if curl -s -o /dev/null -w "%{http_code}" http://blindfoldcubing.com/health 2>/dev/null | grep -q "301\|302"; then
    print_status 0 "HTTP to HTTPS redirect working"
else
    print_warning "HTTP to HTTPS redirect not working"
fi

echo ""
echo "🎉 Production Deployment Complete!"
echo "================================"
echo ""
echo "Your application is now available at:"
echo "  🔒 HTTPS: https://blindfoldcubing.com"
echo "  🔄 HTTP:  http://blindfoldcubing.com (redirects to HTTPS)"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
echo ""
echo "📝 Useful commands:"
echo "  View logs:     docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
echo "  Stop services: docker-compose -f docker-compose.yml -f docker-compose.prod.yml down"
echo "  Restart:       docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart"
echo ""
echo "🔧 Database: Using managed PostgreSQL (not Docker container)"
echo "🔒 SSL: Using Let's Encrypt certificates"
echo ""
echo "📚 For more information, see HTTPS_DEPLOYMENT.md"
