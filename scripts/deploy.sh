#!/bin/bash

# Deploy n8n to production
# Usage: ./deploy.sh [environment]

set -e

# Configuration
ENVIRONMENT="${1:-production}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "n8n Deployment Tool"
echo "==================="
echo "Environment: ${ENVIRONMENT}"
echo ""

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    echo -e "${RED}Error: Invalid environment: ${ENVIRONMENT}${NC}"
    echo "Valid environments: development, staging, production"
    exit 1
fi

# Check if running tests first
echo -e "${YELLOW}Running tests before deployment...${NC}"
if ! ./scripts/test-workflows.sh; then
    echo -e "${RED}Tests failed. Aborting deployment.${NC}"
    exit 1
fi

echo ""

# Build custom nodes
echo -e "${YELLOW}Building custom nodes...${NC}"
cd custom-nodes
if ! npm run build; then
    echo -e "${RED}Build failed. Aborting deployment.${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}Build successful${NC}"
echo ""

# Deploy based on environment
case $ENVIRONMENT in
    development)
        echo -e "${YELLOW}Deploying to development...${NC}"
        docker-compose up -d
        ;;

    staging)
        echo -e "${YELLOW}Deploying to staging...${NC}"
        docker-compose -f infrastructure/docker-compose.yml up -d
        ;;

    production)
        echo -e "${YELLOW}Deploying to production...${NC}"

        # Backup current database
        echo "Creating database backup..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        docker exec n8n-postgres-prod pg_dump -U $POSTGRES_USER $POSTGRES_DB > "backups/db_backup_${timestamp}.sql"
        echo -e "${GREEN}Backup created: backups/db_backup_${timestamp}.sql${NC}"

        # Deploy
        docker-compose -f infrastructure/docker-compose.prod.yml up -d
        ;;
esac

echo ""

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Check if n8n is running
N8N_HOST="${N8N_HOST:-localhost}"
N8N_PORT="${N8N_PORT:-5678}"

if curl -s -o /dev/null -w "%{http_code}" "http://${N8N_HOST}:${N8N_PORT}" | grep -q "200\|401"; then
    echo -e "${GREEN}n8n is running successfully${NC}"
else
    echo -e "${RED}Error: n8n is not responding${NC}"
    exit 1
fi

echo ""
echo "============================="
echo -e "${GREEN}Deployment completed successfully${NC}"
echo "n8n is available at: http://${N8N_HOST}:${N8N_PORT}"
