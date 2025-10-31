# Quick Start Guide

Guia rápido para começar a usar este repositório n8n.

## Instalação Rápida

### 1. Clone o repositório
```bash
git clone <seu-repositorio-url>
cd n8n-private
```

### 2. Configure variáveis de ambiente
```bash
cp .env.example .env
# Edite .env com seus valores
```

### 3. Inicie com Docker
```bash
docker-compose up -d
```

### 4. Acesse o n8n
Abra no navegador: http://localhost:5678

**Credenciais padrão (desenvolvimento):**
- Usuário: `admin`
- Senha: `admin`

**IMPORTANTE:** Altere as credenciais em produção!

## Estrutura Básica

```
n8n-private/
├── workflows/              # Seus workflows
│   ├── core/              # Workflows principais
│   ├── subworkflows/      # Componentes reutilizáveis
│   └── private/           # Workflows privados (não commitados)
│
├── custom-nodes/          # Custom nodes TypeScript
│   └── src/
│       ├── nodes/         # Seus nodes customizados
│       ├── credentials/   # Credenciais customizadas
│       └── utils/         # Funções utilitárias
│
└── scripts/               # Scripts úteis
    ├── export-workflows.sh
    ├── import-workflows.sh
    └── validate-workflows.sh
```

## Comandos Úteis

### Docker
```bash
# Iniciar
npm start
# ou
docker-compose up -d

# Parar
npm stop
# ou
docker-compose down

# Ver logs
npm run logs
# ou
docker-compose logs -f
```

### Workflows
```bash
# Exportar todos os workflows
npm run export

# Importar workflow
npm run import workflows/core/ValidateData.json

# Validar workflows
npm run validate
```

### Custom Nodes
```bash
# Instalar dependências
cd custom-nodes
npm install

# Build
npm run build

# Build em watch mode
npm run build:watch

# Testes
npm test
```

### Testes
```bash
# Todos os testes
npm test

# Apenas unitários
npm run test:unit

# Apenas integração
npm run test:integration

# Com cobertura
npm run test:coverage
```

## Criar Seu Primeiro Workflow

### 1. No n8n UI
1. Acesse http://localhost:5678
2. Clique em "New Workflow"
3. Arraste nodes da sidebar
4. Conecte os nodes
5. Configure cada node
6. Clique em "Execute Workflow" para testar
7. Clique em "Save" e dê um nome

### 2. Exportar o Workflow
```bash
# Via UI: Menu > Download
# Salve em workflows/core/SeuWorkflow.json

# Ou via script:
./scripts/export-workflows.sh <workflow-id> workflows/core/SeuWorkflow.json
```

### 3. Documentar
Crie dois arquivos:

**SeuWorkflow.doc.md**
```markdown
# SeuWorkflow

Descrição do que faz.

## Input
...

## Output
...
```

**SeuWorkflow.changelog.md**
```markdown
# SeuWorkflow Changelog

## [1.0.0] - 2025-10-30
### Added
- Versão inicial
```

## Criar Custom Node

### 1. Estrutura básica
```typescript
// custom-nodes/src/nodes/MeuNode.node.ts
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class MeuNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Meu Node',
    name: 'meuNode',
    group: ['transform'],
    version: 1,
    description: 'Descrição do node',
    inputs: ['main'],
    outputs: ['main'],
    properties: [],
  };

  async execute(this: INodeExecuteFunctions) {
    const items = this.getInputData();
    // Processar items aqui
    return [items];
  }
}
```

### 2. Exportar
```typescript
// custom-nodes/src/nodes/index.ts
export { MeuNode } from './MeuNode.node';
```

### 3. Build e reiniciar
```bash
cd custom-nodes
npm run build
cd ..
docker-compose restart n8n
```

## Deploy

### Desenvolvimento
```bash
npm start
```

### Staging
```bash
npm run deploy:staging
```

### Produção
```bash
npm run deploy:prod
```

## Troubleshooting

### n8n não inicia
```bash
# Verificar logs
docker-compose logs n8n

# Verificar se portas estão em uso
lsof -i :5678

# Recriar containers
docker-compose down
docker-compose up -d --force-recreate
```

### Custom node não aparece
```bash
# Verificar build
cd custom-nodes
npm run build

# Verificar se está exportado em src/nodes/index.ts
cat src/nodes/index.ts

# Reiniciar n8n
docker-compose restart n8n
```

### Workflows não importam
```bash
# Validar JSON
jq empty workflows/core/SeuWorkflow.json

# Verificar permissões
chmod 644 workflows/core/SeuWorkflow.json
```

## Próximos Passos

1. **Explore workflows de exemplo**
   - `workflows/core/ValidateData.json`
   - `workflows/subworkflows/SendEmailNotification.json`

2. **Leia a documentação**
   - [README.md](README.md) - Visão geral
   - [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Arquitetura
   - [CONTRIBUTING.md](CONTRIBUTING.md) - Como contribuir

3. **Configure integrações**
   - Edite `.env` com suas API keys
   - Configure credenciais no n8n UI

4. **Crie seus workflows**
   - Comece com workflows simples
   - Use sub-workflows para reutilizar código
   - Documente tudo

## Recursos

- [n8n Docs](https://docs.n8n.io)
- [n8n Community](https://community.n8n.io)
- [n8n GitHub](https://github.com/n8n-io/n8n)

## Suporte

Abra uma issue ou entre em contato:
- Email: jeandemira@gmail.com

---

**Pronto para começar!** 🚀
