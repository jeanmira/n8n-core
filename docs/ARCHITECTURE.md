# Arquitetura n8n - Guia Completo

Este documento descreve os princípios arquiteturais, padrões de design e boas práticas seguidas neste repositório.

## Índice

1. [Fundamentos de Arquitetura](#fundamentos)
2. [Princípios de Design Modular](#design-modular)
3. [Padrões de Design](#padroes-design)
4. [Fluxo de Dados](#fluxo-dados)
5. [Custom Nodes](#custom-nodes)
6. [Versionamento](#versionamento)
7. [Testing](#testing)

---

## Fundamentos de Arquitetura {#fundamentos}

### Arquitetura Fundamental do n8n

O n8n implementa uma arquitetura modular baseada em componentes desacoplados. Cada parte funciona independentemente:

```
┌─────────────────────────────────────────────────────────┐
│                    n8n Architecture                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Editor Visual (React + TypeScript)             │   │
│  │  - Drag & Drop Interface                        │   │
│  │  - Event Bus (desacoplamento)                   │   │
│  │  - State Management                             │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                               │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Workflow Engine (Node.js Backend)              │   │
│  │  - Execution Engine                             │   │
│  │  - Node Registration System                     │   │
│  │  - Data Transformation Pipeline                 │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                               │
│          ┌───────────────┼───────────────┐              │
│          ▼               ▼               ▼              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Trigger Nodes│ │Process Nodes │ │ Output Nodes │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│          │               │               │              │
│          └───────────────┼───────────────┘              │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Persistence Layer                              │   │
│  │  - Workflow Definitions (JSON)                  │   │
│  │  - Execution Data                               │   │
│  │  - Credentials (Encrypted)                      │   │
│  │  - Database (PostgreSQL/SQLite)                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Três Subsistemas Principais

**1. Frontend (Editor Visual)**
- Construído com React 18 + TypeScript
- Arquitetura em 3 camadas (Presentational, Container, Logic)
- Communication via Event Bus (desacoplamento)
- State management centralizado

**2. Execution Engine (Backend)**
- Responsável pela execução de workflows
- Processa dados através do pipeline de nós
- Gerencia ciclo de vida das automações
- Suporta múltiplos workers para escalabilidade

**3. Persistence Layer**
- Armazena definições de workflows
- Persiste dados de execução
- Gerencia credenciais de forma segura
- Suporta múltiplos backends (PostgreSQL, MySQL, SQLite)

### Fluxo de Execução Padrão

```
Trigger Event
    │
    ▼
[Trigger Node Detecta]
    │
    ▼
[Prepara Data Input] → { json: { ... }, pairedItem: null }
    │
    ▼
[Para Cada Item no Array]
    │
    ├─→ [Node 1 Processa]
    │       │ Transforma dados
    │       ▼ Retorna Array de Items
    │
    ├─→ [Node 2 Processa]
    │       │ Valida e filtra
    │       ▼ Retorna Array de Items
    │
    └─→ [Node N (Output)]
            │ Envia resultado
            ▼ Completa execução
```

**Conceito Crítico:** Cada nó processa um array de items independentemente. Se você tem 5 items entrando em um nó, aquele nó executará 5 vezes.

### Estrutura de Dados do n8n

Todos os dados no n8n seguem uma estrutura padronizada:

```typescript
type ExecutionItem = {
  json: Record<string, any>;
  binary?: Record<string, Binary>;
  pairedItem?: {
    item: number;
  };
};

// Exemplo prático
const items: ExecutionItem[] = [
  {
    json: {
      name: 'Alice',
      email: 'alice@example.com',
      created: '2025-10-30'
    },
    pairedItem: { item: 0 }
  }
];
```

**Por que isso importa:**
- Garantia de isomorfismo entre UI e persistência
- Rastreamento completo de origem de dados
- Facilita debugging e auditoria
- Permite rollback e recovery

---

## Princípios de Design Modular {#design-modular}

### 1. Princípio da Responsabilidade Única (SRP)

Cada workflow deve ter UM único propósito.

```typescript
// ERRADO: Workflow faz tudo (monolítico)
workflow "ProcessarPedido" {
  - Validar pedido
  - Verificar estoque
  - Cobrar cartão
  - Atualizar estoque
  - Enviar email
  - Notificar admin
  - Registrar log
  // 150+ nós em um único fluxo
}

// CERTO: Workflows separados (modular)
workflow "ValidarPedido" {
  - Validar campos obrigatórios
  - Verificar formato de dados
  - Retorna: { valid: true/false, errors: [...] }
}

workflow "VerificarEstoque" {
  - Consulta banco de dados
  - Verifica disponibilidade
  - Retorna: { disponível: true/false, quantidade: n }
}

workflow "ProcessarPedidoMain" {
  - Executa sub-workflows em sequência
  - Coordena o fluxo geral
  - Trata falhas
}
```

**Benefícios:**
- Fácil de testar cada parte isoladamente
- Reutilizável em múltiplos contextos
- Simples de debugar
- Escalável

### 2. Princípio de Isolamento de Dados

Cada workflow deve começar limpo e não depender de estado global.

```typescript
// ERRADO: Depende de estado global/externo
workflow "AtualizarCliente" {
  - Usa variável global: CLIENTES_CACHE
  - Lê de localStorage
  - Depende de ordem de execução
}

// CERTO: Dados explícitos como entrada
workflow "AtualizarCliente" {
  Entrada: {
    clienteId: string,
    novosDados: object,
    usuarioId: string
  }

  - Valida entrada
  - Busca cliente pelo ID
  - Atualiza com novos dados
  - Retorna cliente atualizado
}
```

### 3. Princípio de Composição

Crie workflows complexos a partir de workflows simples.

```typescript
// Workflow básico 1
workflow "BuscarCliente" {
  input: { id: string }
  output: { cliente: object }
}

// Workflow básico 2
workflow "AtualizarEmail" {
  input: { cliente: object, novoEmail: string }
  output: { clienteAtualizado: object }
}

// Workflow composto (reaproveita os 2 anteriores)
workflow "AtualizarEmailCliente" {
  input: { clienteId: string, novoEmail: string }

  - Execute: BuscarCliente(clienteId)
  - Execute: AtualizarEmail(cliente, novoEmail)

  output: { sucesso: boolean }
}
```

---

## Padrões de Design {#padroes-design}

### 1. Pipeline (Série de Transformações)

Use quando dados precisam passar por múltiplas transformações sequenciais.

```
Input → [Filter] → [Transform] → [Validate] → [Output]
```

**Implementação n8n:**
```json
{
  "nodes": [
    { "name": "Webhook", "type": "webhook" },
    { "name": "FilterInvalid", "type": "filter" },
    { "name": "NormalizeData", "type": "set" },
    { "name": "ValidateEmail", "type": "code" },
    { "name": "SaveDB", "type": "postgres" }
  ]
}
```

### 2. Fan-Out/Fan-In

Use quando um evento precisa triggar múltiplas ações em paralelo, depois consolidar resultados.

```
         ┌─→ [Email] ─┐
Input ──→┼─→ [Slack]  ├─→ [Consolidate]
         ├─→ [Log]    │
         └─→ [DB]  ───┘
```

### 3. Retry com Backoff Exponencial

Use quando chamadas de API podem falhar temporariamente.

```
Try Execute
    ↓
Failed?
├─ YES → Wait 1s → Retry 1
         Failed?
         ├─ YES → Wait 2s → Retry 2
                  Failed?
                  ├─ YES → Wait 4s → Retry 3
                  └─ NO → Success
         └─ NO → Success
├─ NO → Success
```

### 4. Circuit Breaker

Use quando serviço externo pode estar sobrecarregado.

```
CLOSED (Normal)
    ↓ [Failures > Threshold]
OPEN (Bloqueado)
    ↓ [Timeout]
HALF_OPEN (Testando)
    ↓ [Sucesso → CLOSED ou Falha → OPEN]
```

### 5. Dead Letter Queue (DLQ)

Use quando mensagens falharem para serem processadas depois.

```
Input
    ↓
Process
    ├─ SUCCESS → Output
    └─ FAILURE → Dead Letter Queue
```

### 6. Adapter Pattern

Use quando precisa integrar múltiplas APIs com interface uniforme.

```typescript
interface IEmailProvider {
  send(to: string, subject: string, body: string): Promise<void>;
}

class SendGridAdapter implements IEmailProvider {
  async send(to: string, subject: string, body: string) {
    return sgMail.send({ to, subject, html: body });
  }
}

class MailgunAdapter implements IEmailProvider {
  async send(to: string, subject: string, body: string) {
    return mailgun.messages().send({ to, subject, html: body });
  }
}
```

---

## Fluxo de Dados {#fluxo-dados}

### Modelo de Dados Canônico

```typescript
// 1. INPUT SCHEMA
type WorkflowInput = {
  source: 'webhook' | 'schedule' | 'manual' | 'event';
  timestamp: Date;
  userId: string;
  correlationId: string;
  data: unknown;
};

// 2. PROCESSING
type ProcessingContext = {
  workflowId: string;
  executionId: string;
  currentStep: string;
  startTime: Date;
  variables: Record<string, unknown>;
};

// 3. OUTPUT SCHEMA
type WorkflowOutput = {
  executionId: string;
  status: 'success' | 'failure' | 'partial';
  timestamp: Date;
  data: unknown;
  errors: Array<{
    step: string;
    code: string;
    message: string;
    recoverable: boolean;
  }>;
  metrics: {
    duration: number;
    itemsProcessed: number;
    itemsFailed: number;
  };
};
```

---

## Custom Nodes {#custom-nodes}

### Estrutura de um Custom Node

```typescript
import {
  INodeType,
  INodeExecuteFunctions,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class MyCustomNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Custom Node',
    name: 'myCustomNode',
    group: ['transform'],
    version: 1,
    description: 'Descrição do que faz',

    inputs: ['main'],
    outputs: ['main'],

    properties: [
      {
        displayName: 'API Key',
        name: 'apiKey',
        type: 'string',
        typeOptions: { password: true },
        required: true,
      },
    ],
  };

  async execute(
    this: INodeExecuteFunctions,
  ): Promise<any[][]> {
    const items = this.getInputData();
    const output = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const item = items[i];
        const result = await this.processItem(item.json);

        output.push({
          json: result,
          pairedItem: { item: i },
        });
      } catch (error) {
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }

    return [output];
  }

  private async processItem(data: any) {
    return { ...data, processed: true };
  }
}
```

---

## Versionamento {#versionamento}

### Semantic Versioning para Workflows

```
MAJOR.MINOR.PATCH
  │      │     └─ Bug fixes, não quebra compatibilidade
  │      └─ Novas features, compatível com versões anteriores
  └─ Mudanças quebradiças

Exemplos:
- 1.0.0: Primeira versão
- 1.1.0: Adicionou nova ação (compatível)
- 1.1.1: Corrigiu bug
- 2.0.0: Mudou input/output format (incompatível)
```

### Git Workflow

```
main (production)
  ↑
  │ (merge com verificação)
  │
release/v1.2.0
  ↑
  │ (cherry-pick fixes)
  │
develop (staging)
  ↑
  │ (merge após PR review)
  │
feature/novo-workflow
```

---

## Testing {#testing}

### Estratégia de Testes

```typescript
describe('ProcessarPedido Workflow', () => {

  // 1. UNIT: Teste cada nó isoladamente
  describe('ValidarPedido Node', () => {
    it('deve rejeitar pedido sem email', async () => {
      const input = { nome: 'Alice' };
      const result = await node.execute(input);
      expect(result.valid).toBe(false);
    });
  });

  // 2. INTEGRATION: Teste fluxo completo
  describe('Fluxo Completo', () => {
    it('deve processar pedido válido até o final', async () => {
      const pedido = {
        id: 'PED-001',
        email: 'customer@example.com',
        total: 99.90
      };

      const result = await executeWorkflow('ProcessarPedido', pedido);
      expect(result.status).toBe('success');
    });
  });

  // 3. EDGE CASES: Teste limites
  describe('Edge Cases', () => {
    it('deve lidar com pedido de R$0.01', async () => {
      const result = await executeWorkflow('ProcessarPedido', {
        total: 0.01
      });
      expect(result.status).toBe('success');
    });
  });
});
```

---

## Resumo: Checklist para Repositório Clean

- Cada workflow tem responsabilidade única
- Workflows exportados como JSON
- Cada workflow tem documentação .doc.md
- Cada workflow tem changelog .changelog.md
- Custom nodes em TypeScript com testes
- Testes unitários e integração
- CI/CD automático para validação
- Versionamento semântico
- Dados isolados por execução
- Logs centralizados com correlationId
- Tratamento de erro em cada nó crítico
- Credenciais never hardcoded
- README claro com exemplos
- CONTRIBUTING.md para contributors
