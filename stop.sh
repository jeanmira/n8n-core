#!/bin/bash
##############################################################################
# @Author: Jean Mira
# @Email:  jeandemira@gmail.com
# @Date:   2025-10-30
##############################################################################

set -e

echo "Parando n8n..."
docker-compose down

echo ""
echo "✓ n8n parado com sucesso!"
echo ""
