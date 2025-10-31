#!/bin/bash

# Import n8n workflows from JSON files
# Usage: ./import-workflows.sh [workflow-file]

set -e

# Configuration
N8N_HOST="${N8N_HOST:-localhost}"
N8N_PORT="${N8N_PORT:-5678}"
N8N_USER="${N8N_BASIC_AUTH_USER:-admin}"
N8N_PASS="${N8N_BASIC_AUTH_PASSWORD:-admin}"
WORKFLOWS_DIR="${WORKFLOWS_DIR:-workflows}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "n8n Workflow Import Tool"
echo "========================"

# Check if n8n is running
if ! curl -s -o /dev/null -w "%{http_code}" "http://${N8N_HOST}:${N8N_PORT}" | grep -q "200\|401"; then
    echo -e "${RED}Error: n8n is not running at http://${N8N_HOST}:${N8N_PORT}${NC}"
    exit 1
fi

# Function to import single workflow
import_workflow() {
    local workflow_file=$1

    if [ ! -f "$workflow_file" ]; then
        echo -e "${RED}Error: File not found: ${workflow_file}${NC}"
        return 1
    fi

    echo -e "${YELLOW}Importing workflow from ${workflow_file}...${NC}"

    # Validate JSON
    if ! jq empty "$workflow_file" 2>/dev/null; then
        echo -e "${RED}Error: Invalid JSON in ${workflow_file}${NC}"
        return 1
    fi

    # Import workflow
    local response=$(curl -s -X POST \
        -u "${N8N_USER}:${N8N_PASS}" \
        -H "Content-Type: application/json" \
        -d @"$workflow_file" \
        "http://${N8N_HOST}:${N8N_PORT}/api/v1/workflows")

    # Check response
    if echo "$response" | jq -e '.id' > /dev/null 2>&1; then
        local workflow_id=$(echo "$response" | jq -r '.id')
        local workflow_name=$(echo "$response" | jq -r '.name')
        echo -e "${GREEN}Workflow imported successfully${NC}"
        echo "  ID: ${workflow_id}"
        echo "  Name: ${workflow_name}"
    else
        echo -e "${RED}Error: Failed to import workflow${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        return 1
    fi
}

# Function to import all workflows from directory
import_all_workflows() {
    local dir=$1

    if [ ! -d "$dir" ]; then
        echo -e "${RED}Error: Directory not found: ${dir}${NC}"
        exit 1
    fi

    echo -e "${YELLOW}Importing all workflows from ${dir}...${NC}"

    local count=0
    local success=0
    local failed=0

    # Find all JSON files
    while IFS= read -r -d '' file; do
        count=$((count + 1))

        if import_workflow "$file"; then
            success=$((success + 1))
        else
            failed=$((failed + 1))
        fi

        echo ""
    done < <(find "$dir" -name "*.json" -type f -print0)

    echo "========================"
    echo "Import Summary:"
    echo "  Total: ${count}"
    echo -e "  ${GREEN}Success: ${success}${NC}"
    if [ $failed -gt 0 ]; then
        echo -e "  ${RED}Failed: ${failed}${NC}"
    fi
}

# Main logic
if [ $# -eq 0 ]; then
    # No arguments, import all workflows from default directory
    import_all_workflows "$WORKFLOWS_DIR"
elif [ $# -eq 1 ]; then
    # One argument
    if [ -f "$1" ]; then
        # It's a file, import single workflow
        import_workflow "$1"
    elif [ -d "$1" ]; then
        # It's a directory, import all workflows
        import_all_workflows "$1"
    else
        echo -e "${RED}Error: Not a file or directory: $1${NC}"
        exit 1
    fi
else
    echo "Usage: $0 [workflow-file or directory]"
    echo ""
    echo "Examples:"
    echo "  $0                              # Import all workflows from ./workflows"
    echo "  $0 my-workflow.json            # Import single workflow"
    echo "  $0 workflows/core/             # Import all from directory"
    exit 1
fi
