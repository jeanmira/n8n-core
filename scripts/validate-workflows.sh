#!/bin/bash

# Validate n8n workflows
# Usage: ./validate-workflows.sh [workflow-file or directory]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "n8n Workflow Validation Tool"
echo "============================="

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is not installed${NC}"
    echo "Install with: sudo apt-get install jq"
    exit 1
fi

# Function to validate single workflow
validate_workflow() {
    local workflow_file=$1
    local errors=0

    echo -e "${YELLOW}Validating: ${workflow_file}${NC}"

    # Check if file exists
    if [ ! -f "$workflow_file" ]; then
        echo -e "${RED}  Error: File not found${NC}"
        return 1
    fi

    # Check if valid JSON
    if ! jq empty "$workflow_file" 2>/dev/null; then
        echo -e "${RED}  Error: Invalid JSON${NC}"
        return 1
    fi

    # Check required fields
    if ! jq -e '.name' "$workflow_file" > /dev/null 2>&1; then
        echo -e "${RED}  Error: Missing 'name' field${NC}"
        errors=$((errors + 1))
    fi

    if ! jq -e '.nodes' "$workflow_file" > /dev/null 2>&1; then
        echo -e "${RED}  Error: Missing 'nodes' field${NC}"
        errors=$((errors + 1))
    fi

    if ! jq -e '.connections' "$workflow_file" > /dev/null 2>&1; then
        echo -e "${RED}  Error: Missing 'connections' field${NC}"
        errors=$((errors + 1))
    fi

    # Check if nodes array is not empty
    local node_count=$(jq '.nodes | length' "$workflow_file")
    if [ "$node_count" -eq 0 ]; then
        echo -e "${RED}  Error: Workflow has no nodes${NC}"
        errors=$((errors + 1))
    fi

    # Check for documentation files
    local base_name=$(basename "$workflow_file" .json)
    local dir_name=$(dirname "$workflow_file")

    if [ ! -f "${dir_name}/${base_name}.doc.md" ]; then
        echo -e "${YELLOW}  Warning: Missing documentation file (${base_name}.doc.md)${NC}"
    fi

    if [ ! -f "${dir_name}/${base_name}.changelog.md" ]; then
        echo -e "${YELLOW}  Warning: Missing changelog file (${base_name}.changelog.md)${NC}"
    fi

    # Print workflow info
    local workflow_name=$(jq -r '.name' "$workflow_file")
    echo "  Name: ${workflow_name}"
    echo "  Nodes: ${node_count}"

    # Return status
    if [ $errors -eq 0 ]; then
        echo -e "${GREEN}  Status: Valid${NC}"
        return 0
    else
        echo -e "${RED}  Status: Invalid (${errors} errors)${NC}"
        return 1
    fi
}

# Function to validate all workflows in directory
validate_directory() {
    local dir=$1
    local total=0
    local valid=0
    local invalid=0

    echo -e "${YELLOW}Validating all workflows in ${dir}...${NC}"
    echo ""

    while IFS= read -r -d '' file; do
        total=$((total + 1))

        if validate_workflow "$file"; then
            valid=$((valid + 1))
        else
            invalid=$((invalid + 1))
        fi

        echo ""
    done < <(find "$dir" -name "*.json" -type f -print0)

    echo "============================="
    echo "Validation Summary:"
    echo "  Total: ${total}"
    echo -e "  ${GREEN}Valid: ${valid}${NC}"
    if [ $invalid -gt 0 ]; then
        echo -e "  ${RED}Invalid: ${invalid}${NC}"
        return 1
    fi

    return 0
}

# Main logic
if [ $# -eq 0 ]; then
    # No arguments, validate all workflows
    validate_directory "workflows"
elif [ $# -eq 1 ]; then
    if [ -f "$1" ]; then
        # Single file
        if validate_workflow "$1"; then
            exit 0
        else
            exit 1
        fi
    elif [ -d "$1" ]; then
        # Directory
        if validate_directory "$1"; then
            exit 0
        else
            exit 1
        fi
    else
        echo -e "${RED}Error: Not a file or directory: $1${NC}"
        exit 1
    fi
else
    echo "Usage: $0 [workflow-file or directory]"
    echo ""
    echo "Examples:"
    echo "  $0                          # Validate all workflows"
    echo "  $0 my-workflow.json        # Validate single workflow"
    echo "  $0 workflows/core/         # Validate directory"
    exit 1
fi
