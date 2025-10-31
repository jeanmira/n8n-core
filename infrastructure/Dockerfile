# n8n Custom Dockerfile
FROM n8nio/n8n:latest

USER root

# Install additional dependencies if needed
RUN apk add --no-cache \
    python3 \
    py3-pip \
    build-base

# Create directories for custom nodes
RUN mkdir -p /home/node/.n8n/custom
RUN mkdir -p /home/node/.n8n/nodes

# Copy custom nodes
COPY --chown=node:node custom-nodes/ /home/node/.n8n/custom/

# Install custom nodes dependencies
WORKDIR /home/node/.n8n/custom
RUN if [ -f package.json ]; then npm install --production; fi

# Copy configuration files
COPY --chown=node:node config/ /home/node/.n8n/config/

# Set working directory back
WORKDIR /home/node

# Switch back to node user
USER node

# Expose n8n port
EXPOSE 5678

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5678/healthz || exit 1

# Start n8n
CMD ["n8n"]
