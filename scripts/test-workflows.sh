#!/bin/bash

# Test n8n workflows
# Usage: ./test-workflows.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "n8n Workflow Test Runner"
echo "========================"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

# Run unit tests
echo -e "${YELLOW}Running unit tests...${NC}"
if npm run test:unit; then
    echo -e "${GREEN}Unit tests passed${NC}"
else
    echo -e "${RED}Unit tests failed${NC}"
    exit 1
fi

echo ""

# Run integration tests
echo -e "${YELLOW}Running integration tests...${NC}"
if npm run test:integration; then
    echo -e "${GREEN}Integration tests passed${NC}"
else
    echo -e "${RED}Integration tests failed${NC}"
    exit 1
fi

echo ""

# Validate all workflows
echo -e "${YELLOW}Validating workflows...${NC}"
if ./scripts/validate-workflows.sh; then
    echo -e "${GREEN}All workflows are valid${NC}"
else
    echo -e "${RED}Some workflows are invalid${NC}"
    exit 1
fi

echo ""
echo "========================"
echo -e "${GREEN}All tests passed successfully${NC}"
