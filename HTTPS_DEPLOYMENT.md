# HTTPS Deployment Guide

This guide explains how to deploy your BLD Memory Trainer application with HTTPS support on port 443.

## 🏗️ Architecture Overview

The HTTPS deployment supports two architectures:

### Development Architecture
```
Internet → Nginx (Port 443/80) → Frontend (Port 3000) + Backend (Port 8000) + PostgreSQL (Port 5432)
```

### Production Architecture
```
Internet → Nginx (Port 443/80) → Frontend (Port 3000) + Backend (Port 8000) → Managed PostgreSQL
```

**Components:**
- **Nginx**: Reverse proxy with SSL/TLS termination
- **Frontend**: React application served on port 3000
- **Backend**: FastAPI application on port 8000
- **PostgreSQL**: 
  - **Development**: Docker container on port 5432
  - **Production**: Managed database service (AWS RDS, Google Cloud SQL, etc.)

## 🚀 Quick Start

### 1. Development/Testing Setup

For development or testing with self-signed certificates:

```bash
# Start the application with self-signed SSL
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Your application will be available at:
# https://blindfoldcubing.com (with SSL warning)
# http://blindfoldcubing.com (redirects to HTTPS)
```

### 2. Production Setup

For production with real SSL certificates and managed PostgreSQL:

```bash
# 1. Configure production environment
cp production.env.example production.env
# Edit production.env with your managed database credentials

# 2. Deploy with production script
./deploy-production.sh

# Your application will be available at:
# https://blindfoldcubing.com
```

### 3. Manual Production Setup

If you prefer manual setup:

```bash
# 1. Set up SSL certificates
./ssl/setup-production-ssl.sh blindfoldcubing.com

# 2. Configure environment variables
export DATABASE_URL="postgresql://user:pass@your-managed-db:5432/dbname"
export FIREBASE_PROJECT_ID="your-project-id"
export FIREBASE_CREDENTIALS_PATH="/app/firebase-credentials.json"
export ALLOWED_ORIGINS='["https://blindfoldcubing.com", "https://www.blindfoldcubing.com"]'

# 3. Start production services (without PostgreSQL)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🗄️ Database Configuration

The deployment supports two database modes:

### Development Mode (Docker PostgreSQL)
- **Use case**: Local development and testing
- **Database**: PostgreSQL container in Docker
- **Connection**: `postgresql://bld_user:bld_password@postgres:5432/bld_trainer`
- **Command**: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`
- **Pros**: Self-contained, no external dependencies
- **Cons**: Data not persistent, not suitable for production

### Production Mode (Managed PostgreSQL)
- **Use case**: Live production deployment
- **Database**: Managed service (AWS RDS, Google Cloud SQL, Azure Database, etc.)
- **Connection**: Provided via `DATABASE_URL` environment variable
- **Command**: `./deploy-production.sh` or `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
- **Pros**: Scalable, managed, persistent, production-ready
- **Cons**: Requires external service, costs money

## 🔒 SSL Certificate Strategy

The deployment supports two SSL certificate modes:

### Development Mode (Self-Signed Certificates)
- **Use case**: Local development and testing
- **Certificate source**: Generated inside the nginx container
- **Command**: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`
- **Pros**: No external dependencies, works offline
- **Cons**: Browser security warnings, not trusted by browsers

### Production Mode (Let's Encrypt Certificates)
- **Use case**: Live production deployment
- **Certificate source**: Generated on host system and mounted into container
- **Command**: `./ssl/setup-production-ssl.sh blindfoldcubing.com && docker-compose up -d`
- **Pros**: Trusted by browsers, automatic renewal
- **Cons**: Requires internet access, domain DNS setup

## 🔒 SSL Certificate Options

### Option 1: Let's Encrypt (Recommended for Production)

```bash
# Install certbot (Ubuntu/Debian)
sudo apt-get update && sudo apt-get install certbot

# Generate certificate
./ssl/setup-production-ssl.sh blindfoldcubing.com
```

### Option 2: Self-Signed Certificate (Development/Testing)

```bash
# Generate self-signed certificate
./ssl/setup-production-ssl.sh --self-signed blindfoldcubing.com
```

### Option 3: Custom Certificate

If you have your own SSL certificate:

```bash
# Copy your certificate files
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem

# Set proper permissions
chmod 644 ssl/cert.pem
chmod 600 ssl/key.pem
```

## 🔧 Configuration Details

### Nginx Configuration

The Nginx configuration (`nginx/nginx.conf`) includes:

- **SSL/TLS**: Modern TLS 1.2/1.3 with secure ciphers
- **Security Headers**: HSTS, X-Frame-Options, etc.
- **Rate Limiting**: API protection against abuse
- **CORS**: Proper CORS headers for API requests
- **Compression**: Gzip compression for better performance
- **Caching**: Static file caching with proper headers

### Docker Compose Changes

Key changes made to `docker-compose.yml`:

1. **Added Nginx service** with SSL support
2. **Updated port mappings**:
   - Nginx: 80 (HTTP) → 443 (HTTPS redirect)
   - Nginx: 443 (HTTPS)
   - Backend/Frontend: Internal only (no external ports)
3. **Updated environment variables** for HTTPS URLs
4. **Added SSL volume mount** for certificate management

### Environment Variables

Updated environment variables for HTTPS:

```yaml
# Backend CORS origins (now includes HTTPS)
ALLOWED_ORIGINS: '["https://blindfoldcubing.com", "https://www.blindfoldcubing.com", "https://localhost", ...]'

# Frontend API URL (now HTTPS)
API_BASE_URL: https://blindfoldcubing.com/api/v1
```

## 🛠️ Deployment Commands

### Development Commands

```bash
# Start development environment (with Docker PostgreSQL)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

### Production Commands

```bash
# Deploy production environment (with managed PostgreSQL)
./deploy-production.sh

# Or manually:
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Stop production environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### Update the Application

```bash
# Development
git pull
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# Production
git pull
./deploy-production.sh
```

## 🔍 Troubleshooting

### Common Issues

1. **SSL Certificate Errors**
   ```bash
   # Check certificate files
   ls -la ssl/
   
   # Verify certificate
   openssl x509 -in ssl/cert.pem -text -noout
   ```

2. **Port Conflicts**
   ```bash
   # Check if ports 80/443 are in use
   sudo netstat -tlnp | grep -E ':(80|443)'
   
   # Stop conflicting services
   sudo systemctl stop apache2  # or nginx, etc.
   ```

3. **Container Issues**
   ```bash
   # Check container logs
   docker-compose logs nginx
   docker-compose logs backend
   docker-compose logs frontend
   
   # Restart specific service
   docker-compose restart nginx
   ```

4. **CORS Issues**
   - Verify `ALLOWED_ORIGINS` includes your HTTPS domain
   - Check browser developer tools for CORS errors
   - Ensure API calls use HTTPS URLs

### Health Checks

```bash
# Check if services are running
curl -k https://localhost/health

# Check SSL certificate
openssl s_client -connect blindfoldcubing.com:443 -servername blindfoldcubing.com

# Test API endpoints
curl -k https://blindfoldcubing.com/api/v1/health
```

## 🔄 SSL Certificate Renewal

### Let's Encrypt Auto-Renewal

```bash
# Add to crontab for automatic renewal
echo '0 12 * * * /usr/bin/certbot renew --quiet && docker-compose restart nginx' | crontab -

# Test renewal
certbot renew --dry-run
```

### Manual Renewal

```bash
# Renew certificate
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/blindfoldcubing.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/blindfoldcubing.com/privkey.pem ssl/key.pem

# Restart nginx
docker-compose restart nginx
```

## 📊 Performance Optimization

### Nginx Optimizations

The configuration includes several performance optimizations:

- **HTTP/2**: Enabled for better multiplexing
- **Gzip Compression**: Reduces bandwidth usage
- **Static File Caching**: Long-term caching for assets
- **Connection Pooling**: Efficient upstream connections

### Monitoring

```bash
# Monitor nginx access logs
docker-compose logs -f nginx

# Check SSL certificate expiration
openssl x509 -in ssl/cert.pem -noout -dates

# Monitor resource usage
docker stats
```

## 🔐 Security Considerations

### Production Security Checklist

- [ ] Use Let's Encrypt or trusted CA certificates
- [ ] Enable HSTS headers (already configured)
- [ ] Set up proper firewall rules
- [ ] Regular security updates
- [ ] Monitor SSL certificate expiration
- [ ] Use strong SSL ciphers (already configured)
- [ ] Implement rate limiting (already configured)

### Firewall Configuration

```bash
# Allow HTTPS traffic
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp

# Block direct access to backend/frontend
sudo ufw deny 3000/tcp
sudo ufw deny 8000/tcp
```

## 📝 Environment-Specific Configuration

### Development

```bash
# Use self-signed certificates
./ssl/setup-production-ssl.sh --self-signed localhost
docker-compose up -d
```

### Staging

```bash
# Use Let's Encrypt staging environment
certbot certonly --staging -d staging.blindfoldcubing.com
```

### Production

```bash
# Use production Let's Encrypt certificates
./ssl/setup-production-ssl.sh blindfoldcubing.com
docker-compose up -d
```

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify SSL certificates: `openssl x509 -in ssl/cert.pem -text`
3. Test connectivity: `curl -k https://blindfoldcubing.com/health`
4. Check firewall rules: `sudo ufw status`

For additional help, refer to the main documentation or create an issue in the repository.
