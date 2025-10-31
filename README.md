# n8n Private Repository

> Repositório profissional para workflows, custom nodes e automações n8n seguindo arquitetura modular e clean.

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-private-red.svg)]()

---

## Indice

- [Sobre o Projeto](#sobre-o-projeto)
- [Estrutura do Repositório](#estrutura-do-repositorio)
- [Pré-requisitos](#pre-requisitos)
- [Instalação](#instalacao)
- [Uso](#uso)
- [Workflows](#workflows)
- [Custom Nodes](#custom-nodes)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)
- [Documentação](#documentacao)

---

## Sobre o Projeto

Este repositório contém uma implementação profissional de n8n com:

- **Arquitetura Modular**: Workflows organizados por domínio e responsabilidade
- **Custom Nodes**: Nodes TypeScript customizados e extensíveis
- **Versionamento**: Controle de versão semântico para workflows
- **Testes**: Testes unitários e de integração
- **CI/CD**: Pipelines automatizados de teste e deploy
- **Documentação**: Documentação completa de workflows e nodes
- **Docker**: Infraestrutura como código

---

## Estrutura do Repositório

```
n8n-private/
├── workflows/              # Workflows exportados (JSON)
│   ├── core/              # Workflows essenciais do sistema
│   ├── integrations/      # Integrações com serviços externos
│   ├── subworkflows/      # Sub-workflows reutilizáveis
│   └── deprecated/        # Workflows obsoletos (mantidos para referência)
│
├── custom-nodes/          # Custom nodes TypeScript
│   └── src/
│       ├── nodes/         # Implementações de nodes
│       ├── credentials/   # Credenciais customizadas
│       └── utils/         # Utilitários compartilhados
│
├── tests/                 # Suite de testes
│   ├── unit/             # Testes unitários
│   ├── integration/      # Testes de integração
│   └── fixtures/         # Dados de teste
│
├── infrastructure/        # Configuração de infraestrutura
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── kubernetes/
│
├── scripts/              # Scripts de automação
│   ├── export-workflows.sh
│   ├── import-workflows.sh
│   └── validate-workflows.sh
│
├── config/               # Configurações globais
│   ├── n8n.config.ts
│   └── integrations.config.ts
│
└── docs/                 # Documentação
    ├── ARCHITECTURE.md
    ├── WORKFLOWS.md
    ├── CUSTOM_NODES.md
    └── DEPLOYMENT.md
```

---

## Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x ou **pnpm** >= 8.x
- **Docker** >= 24.x (para ambiente local)
- **Docker Compose** >= 2.x
- **Git** >= 2.30

---

## Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd n8n-private
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite .env com suas configurações
```

### 3. Inicie o ambiente com Docker

```bash
# Ambiente de desenvolvimento
docker-compose up -d

# Ambiente de produção
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Acesse o n8n

Abra o navegador em: `http://localhost:5678`

---

## Uso

### Importar Workflows

```bash
./scripts/import-workflows.sh workflows/core/ValidarDados.json
```

### Exportar Workflows

```bash
./scripts/export-workflows.sh <workflow-id> workflows/core/NovoWorkflow.json
```

### Validar Workflows

```bash
./scripts/validate-workflows.sh workflows/
```

### Rodar Testes

```bash
npm test                    # Todos os testes
npm run test:unit          # Apenas testes unitários
npm run test:integration   # Apenas testes de integração
```

---

## Workflows

### Convenção de Nomenclatura

```
{Domain}{Action}{Entity}.json
```

**Exemplos:**
- `CrmSyncContacts.json` - Sincroniza contatos com CRM
- `EmailNotificationOrder.json` - Envia notificação de pedido
- `ValidateDataWebhook.json` - Valida dados de webhook

### Estrutura de um Workflow

Cada workflow deve ter:

1. **Arquivo JSON** - Definição do workflow
2. **Documentação** - `{Nome}.doc.md` com descrição, inputs/outputs
3. **Changelog** - `{Nome}.changelog.md` com histórico de versões
4. **Testes** (opcional) - `{Nome}.spec.json` para validação

### Exemplo

```
workflows/core/
├── ValidarDados.json
├── ValidarDados.doc.md
├── ValidarDados.changelog.md
└── ValidarDados.spec.json
```

Veja [docs/WORKFLOWS.md](docs/WORKFLOWS.md) para mais detalhes.

---

## Custom Nodes

### Criar um Custom Node

```bash
cd custom-nodes
npm run create-node -- MyCustomNode
```

### Estrutura de um Node

```typescript
// custom-nodes/src/nodes/MyCustomNode.ts
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class MyCustomNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Custom Node',
    name: 'myCustomNode',
    group: ['transform'],
    version: 1,
    // ...
  };

  async execute() {
    // Implementação
  }
}
```

Veja [docs/CUSTOM_NODES.md](docs/CUSTOM_NODES.md) para mais detalhes.

---

## Testes

### Rodar Testes

```bash
# Todos os testes
npm test

# Com cobertura
npm run test:coverage

# Watch mode
npm run test:watch
```

### Estrutura de Testes

```typescript
// tests/unit/workflows.test.ts
describe('ValidarDados Workflow', () => {
  it('deve rejeitar dados inválidos', async () => {
    const result = await executeWorkflow('ValidarDados', invalidData);
    expect(result.status).toBe('failure');
  });
});
```

---

## Deploy

### Desenvolvimento

```bash
docker-compose up -d
```

### Produção

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes

```bash
kubectl apply -f infrastructure/kubernetes/
```

Veja [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) para mais detalhes.

---

## Contribuindo

Leia [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre:

- Padrões de código
- Processo de pull request
- Versionamento
- Testes obrigatórios

---

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md) - Princípios e padrões de design
- [Workflows](docs/WORKFLOWS.md) - Guia de workflows
- [Custom Nodes](docs/CUSTOM_NODES.md) - Como criar custom nodes
- [Deployment](docs/DEPLOYMENT.md) - Guia de deploy
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Solução de problemas comuns

---

## Licença

Este é um repositório privado. Todos os direitos reservados.

---

## Autores

- **Jean Mira** - *Desenvolvedor Principal*

---

## Suporte

Para questões e suporte:
- Abra uma issue neste repositório
- Entre em contato: jeandemira@gmail.com

---

**Última atualização:** 2025-10-30
