#!/bin/bash

# HTTPS Deployment Test Script
# This script tests the HTTPS deployment configuration

set -e

echo "🧪 HTTPS Deployment Test"
echo "========================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose not found. Please install Docker Compose.${NC}"
    exit 1
fi

echo "1. Checking Docker Compose configuration..."
if [ -f "docker-compose.yml" ]; then
    print_status 0 "docker-compose.yml found"
else
    print_status 1 "docker-compose.yml not found"
    exit 1
fi

echo ""
echo "2. Checking Nginx configuration..."
if [ -f "nginx/nginx.conf" ]; then
    print_status 0 "nginx/nginx.conf found"
else
    print_status 1 "nginx/nginx.conf not found"
    exit 1
fi

echo ""
echo "3. Checking SSL certificate setup..."
if [ -f "ssl/setup-production-ssl.sh" ]; then
    print_status 0 "SSL setup script found"
else
    print_status 1 "SSL setup script not found"
fi

echo ""
echo "4. Testing Docker Compose configuration..."
if docker-compose config > /dev/null 2>&1; then
    print_status 0 "Docker Compose configuration is valid"
else
    print_status 1 "Docker Compose configuration has errors"
    echo "Run 'docker-compose config' to see the errors"
    exit 1
fi

echo ""
echo "5. Checking if services are running..."
if docker-compose ps | grep -q "Up"; then
    print_status 0 "Some services are already running"
    echo "Current services:"
    docker-compose ps
else
    print_warning "No services are currently running"
    echo "You can start them with: docker-compose up -d"
fi

echo ""
echo "6. Testing HTTPS connectivity (if services are running)..."

# Check if nginx is running
if docker-compose ps nginx | grep -q "Up"; then
    echo "Testing HTTPS connection..."
    
    # Test HTTPS endpoint
    if curl -k -s -o /dev/null -w "%{http_code}" https://blindfoldcubing.com/health 2>/dev/null | grep -q "200"; then
        print_status 0 "HTTPS health check endpoint responding"
    else
        print_warning "HTTPS health check failed (this is normal if services aren't running)"
    fi
    
    # Test HTTP to HTTPS redirect
    if curl -s -o /dev/null -w "%{http_code}" http://blindfoldcubing.com/health 2>/dev/null | grep -q "301\|302"; then
        print_status 0 "HTTP to HTTPS redirect working"
    else
        print_warning "HTTP to HTTPS redirect not working (this is normal if services aren't running)"
    fi
else
    print_warning "Nginx service not running. Start services with: docker-compose up -d"
fi

echo ""
echo "7. SSL Certificate Information (if available)..."
if [ -f "ssl/cert.pem" ]; then
    print_status 0 "SSL certificate found"
    
    # Get certificate information
    if command -v openssl &> /dev/null; then
        echo "Certificate details:"
        openssl x509 -in ssl/cert.pem -noout -subject -dates 2>/dev/null || echo "Could not read certificate details"
    fi
else
    print_warning "SSL certificate not found"
    echo "Generate one with: ./ssl/setup-production-ssl.sh blindfoldcubing.com"
fi

echo ""
echo "8. Port availability check..."
if netstat -tlnp 2>/dev/null | grep -q ":443 "; then
    print_warning "Port 443 is already in use"
    echo "You may need to stop other services using port 443"
else
    print_status 0 "Port 443 is available"
fi

if netstat -tlnp 2>/dev/null | grep -q ":80 "; then
    print_warning "Port 80 is already in use"
    echo "You may need to stop other services using port 80"
else
    print_status 0 "Port 80 is available"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. Generate SSL certificate:"
echo "   ./ssl/setup-production-ssl.sh blindfoldcubing.com"
echo ""
echo "2. Start the application:"
echo "   docker-compose up -d"
echo ""
echo "3. Test the deployment:"
echo "   curl -k https://blindfoldcubing.com/health"
echo ""
echo "4. View logs:"
echo "   docker-compose logs -f"
echo ""
echo "5. Stop the application:"
echo "   docker-compose down"
echo ""

echo "📚 For more information, see HTTPS_DEPLOYMENT.md"
