FROM nginx:alpine

# Install openssl for certificate generation
RUN apk add --no-cache openssl

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create SSL directory (certificates will be mounted from host or generated)
RUN mkdir -p /etc/nginx/ssl

# Expose ports
EXPOSE 80 443

# Use custom entrypoint that ensures SSL certificates exist
ENTRYPOINT ["/docker-entrypoint.sh"]
