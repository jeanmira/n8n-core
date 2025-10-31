#!/bin/bash

# Export n8n workflows to JSON files
# Usage: ./export-workflows.sh [workflow-id] [output-file]

set -e

# Configuration
N8N_HOST="${N8N_HOST:-localhost}"
N8N_PORT="${N8N_PORT:-5678}"
N8N_USER="${N8N_BASIC_AUTH_USER:-admin}"
N8N_PASS="${N8N_BASIC_AUTH_PASSWORD:-admin}"
OUTPUT_DIR="${OUTPUT_DIR:-workflows}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "n8n Workflow Export Tool"
echo "========================"

# Check if n8n is running
if ! curl -s -o /dev/null -w "%{http_code}" "http://${N8N_HOST}:${N8N_PORT}" | grep -q "200\|401"; then
    echo -e "${RED}Error: n8n is not running at http://${N8N_HOST}:${N8N_PORT}${NC}"
    exit 1
fi

# Function to export single workflow
export_workflow() {
    local workflow_id=$1
    local output_file=$2

    echo -e "${YELLOW}Exporting workflow ${workflow_id}...${NC}"

    # Get workflow data
    local response=$(curl -s -u "${N8N_USER}:${N8N_PASS}" \
        "http://${N8N_HOST}:${N8N_PORT}/api/v1/workflows/${workflow_id}")

    # Check if response is valid JSON
    if ! echo "$response" | jq empty 2>/dev/null; then
        echo -e "${RED}Error: Failed to export workflow ${workflow_id}${NC}"
        return 1
    fi

    # Save to file
    echo "$response" | jq '.' > "$output_file"

    echo -e "${GREEN}Workflow exported to: ${output_file}${NC}"
}

# Function to export all workflows
export_all_workflows() {
    echo -e "${YELLOW}Exporting all workflows...${NC}"

    # Get list of workflows
    local workflows=$(curl -s -u "${N8N_USER}:${N8N_PASS}" \
        "http://${N8N_HOST}:${N8N_PORT}/api/v1/workflows")

    # Parse and export each workflow
    echo "$workflows" | jq -r '.data[] | "\(.id)|\(.name)"' | while IFS='|' read -r id name; do
        # Sanitize filename
        local safe_name=$(echo "$name" | tr ' ' '_' | tr -cd '[:alnum:]_-')
        local output_file="${OUTPUT_DIR}/core/${safe_name}.json"

        # Create directory if it doesn't exist
        mkdir -p "$(dirname "$output_file")"

        # Export workflow
        export_workflow "$id" "$output_file"
    done

    echo -e "${GREEN}All workflows exported successfully${NC}"
}

# Main logic
if [ $# -eq 0 ]; then
    # No arguments, export all workflows
    export_all_workflows
elif [ $# -eq 1 ]; then
    # One argument (workflow ID), auto-generate output filename
    workflow_id=$1
    output_file="${OUTPUT_DIR}/workflow_${workflow_id}.json"
    mkdir -p "$(dirname "$output_file")"
    export_workflow "$workflow_id" "$output_file"
elif [ $# -eq 2 ]; then
    # Two arguments (workflow ID and output file)
    workflow_id=$1
    output_file=$2
    mkdir -p "$(dirname "$output_file")"
    export_workflow "$workflow_id" "$output_file"
else
    echo "Usage: $0 [workflow-id] [output-file]"
    echo ""
    echo "Examples:"
    echo "  $0                              # Export all workflows"
    echo "  $0 1                            # Export workflow with ID 1"
    echo "  $0 1 my-workflow.json          # Export to specific file"
    exit 1
fi
