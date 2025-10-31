# Custom Nodes

Este diretório contém custom nodes TypeScript para n8n.

## Estrutura

```
custom-nodes/
├── src/
│   ├── nodes/          # Implementações de nodes
│   ├── credentials/    # Credenciais customizadas
│   └── utils/          # Utilitários compartilhados
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── jest.config.js      # Test config
```

## Desenvolvimento

### Instalar Dependências

```bash
cd custom-nodes
npm install
```

### Build

```bash
npm run build          # Build once
npm run build:watch    # Build em watch mode
```

### Testes

```bash
npm test               # Rodar testes
npm run test:watch     # Testes em watch mode
npm run test:coverage  # Cobertura de testes
```

### Lint

```bash
npm run lint           # Verificar código
npm run lint:fix       # Corrigir automaticamente
```

## Criar um Novo Node

1. Crie um arquivo em `src/nodes/`
2. Implemente a interface `INodeType`
3. Exporte o node em `src/nodes/index.ts`
4. Build o projeto
5. Reinicie o n8n

### Exemplo

```typescript
// src/nodes/MyCustomNode.node.ts
import {
  INodeType,
  INodeTypeDescription,
  INodeExecuteFunctions,
} from 'n8n-workflow';

export class MyCustomNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Custom Node',
    name: 'myCustomNode',
    group: ['transform'],
    version: 1,
    description: 'Node description',
    defaults: {
      name: 'My Custom Node',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [],
  };

  async execute(this: INodeExecuteFunctions) {
    const items = this.getInputData();
    return [items];
  }
}
```

## Criar Credenciais

1. Crie um arquivo em `src/credentials/`
2. Implemente a interface `ICredentialType`
3. Exporte as credenciais em `src/credentials/index.ts`

### Exemplo

```typescript
// src/credentials/MyApiCredentials.credentials.ts
import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MyApiCredentials implements ICredentialType {
  name = 'myApiCredentials';
  displayName = 'My API Credentials';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
    },
  ];
}
```

## Versionamento

Siga Semantic Versioning:
- `MAJOR`: Mudanças quebradiças
- `MINOR`: Novas features (compatível)
- `PATCH`: Bug fixes

## Testes

Todo node deve ter testes:

```typescript
// src/nodes/MyCustomNode.test.ts
import { MyCustomNode } from './MyCustomNode.node';

describe('MyCustomNode', () => {
  it('should process items correctly', async () => {
    // Teste aqui
  });
});
```

## Documentação

Documente cada node com JSDoc:

```typescript
/**
 * MyCustomNode
 *
 * Node para processar dados específicos.
 *
 * @version 1.0.0
 * @author Your Name
 */
export class MyCustomNode implements INodeType {
  // ...
}
```
