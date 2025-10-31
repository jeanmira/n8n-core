#!/bin/bash
##############################################################################
# @Author: Jean Mira
# @Email:  jeandemira@gmail.com
# @Date:   2025-10-30
##############################################################################

set -e

echo "========================================="
echo "n8n Setup Script"
echo "========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "[ERRO] Docker não está instalado!"
    echo "Instale com: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "[ERRO] Docker Compose não está instalado!"
    echo "Instale com: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "[OK] Docker instalado"
echo "[OK] Docker Compose instalado"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
    echo "[OK] Arquivo .env criado"
    echo ""
    echo "[IMPORTANTE] Edite o .env e configure:"
    echo "   - Senhas de banco de dados"
    echo "   - Senha de autenticação"
    echo "   - Encryption key (gere com: openssl rand -base64 32)"
    echo ""
else
    echo "[OK] Arquivo .env já existe"
    echo ""
fi

# Check if encryption key is set
if ! grep -q "N8N_ENCRYPTION_KEY=.\+" .env; then
    echo "[AVISO] Encryption key não configurada!"
    echo "Gerando encryption key..."
    ENCRYPTION_KEY=$(openssl rand -base64 32)

    # Update .env with encryption key
    if grep -q "N8N_ENCRYPTION_KEY=$" .env; then
        sed -i "s|N8N_ENCRYPTION_KEY=|N8N_ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env
        echo "[OK] Encryption key gerada e configurada"
    else
        echo "# Generated encryption key" >> .env
        echo "N8N_ENCRYPTION_KEY=${ENCRYPTION_KEY}" >> .env
        echo "[OK] Encryption key gerada e adicionada ao .env"
    fi
    echo ""
fi

# Install npm dependencies for custom nodes
if [ -d "custom-nodes" ] && [ -f "custom-nodes/package.json" ]; then
    echo "Instalando dependências dos custom nodes..."
    cd custom-nodes
    npm install
    echo "[OK] Dependências instaladas"
    cd ..
    echo ""
fi

# Install root npm dependencies
if [ -f "package.json" ]; then
    echo "Instalando dependências do projeto..."
    npm install
    echo "[OK] Dependências instaladas"
    echo ""
fi

# Create necessary directories
echo "Criando diretórios necessários..."
mkdir -p workflows/private
mkdir -p backups
echo "[OK] Diretórios criados"
echo ""

# Build custom nodes
if [ -d "custom-nodes" ]; then
    echo "Compilando custom nodes..."
    cd custom-nodes
    npm run build
    echo "[OK] Custom nodes compilados"
    cd ..
    echo ""
fi

echo "========================================="
echo "Setup concluído!"
echo "========================================="
echo ""
echo "Próximos passos:"
echo ""
echo "1. Revise o arquivo .env e ajuste conforme necessário"
echo "2. Inicie o n8n:"
echo "   docker-compose up -d"
echo ""
echo "3. Acesse: http://localhost:5678"
echo "   Usuário: admin"
echo "   Senha: (veja N8N_BASIC_AUTH_PASSWORD no .env)"
echo ""
echo "4. Leia QUICKSTART.md para mais informações"
echo ""
