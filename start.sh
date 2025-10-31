#!/bin/bash
##############################################################################
# @Author: Jean Mira
# @Email:  jeandemira@gmail.com
# @Date:   2025-10-30
##############################################################################

set -e

echo "Iniciando n8n..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "[ERRO] Arquivo .env não encontrado!"
    echo "Execute primeiro: ./setup.sh"
    exit 1
fi

# Start Docker Compose
docker-compose up -d

echo ""
echo "[OK] n8n iniciado com sucesso!"
echo ""
echo "Acesse: http://localhost:5678"
echo ""
echo "Para ver logs:"
echo "  docker-compose logs -f"
echo ""
echo "Para parar:"
echo "  docker-compose down"
echo ""
