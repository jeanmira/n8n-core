# Guia de Contribuição

Obrigado por contribuir com este projeto! Este documento fornece diretrizes para garantir qualidade e consistência.

---

## Indice

- [Código de Conduta](#codigo-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padroes-de-codigo)
- [Convenções de Nomenclatura](#convencoes-de-nomenclatura)
- [Commits e Pull Requests](#commits-e-pull-requests)
- [Testes](#testes)
- [Documentação](#documentacao)

---

## Código de Conduta

Este projeto segue princípios de:
- Respeito mútuo
- Colaboração construtiva
- Código de qualidade
- Transparência nas decisões

---

## Como Contribuir

### 1. Criar uma Branch

```bash
git checkout -b feature/nome-da-feature
git checkout -b fix/nome-do-bug
git checkout -b docs/nome-da-doc
```

**Convenção de branches:**
- `feature/*` - Novas funcionalidades
- `fix/*` - Correções de bugs
- `docs/*` - Documentação
- `refactor/*` - Refatoração de código
- `test/*` - Adição de testes

### 2. Fazer Alterações

- Siga os padrões de código deste guia
- Adicione testes para novas funcionalidades
- Atualize documentação quando necessário
- Mantenha commits atômicos e descritivos

### 3. Testar

```bash
# Rodar todos os testes
npm test

# Validar workflows
./scripts/validate-workflows.sh

# Verificar linting
npm run lint
```

### 4. Commit

```bash
git add .
git commit -m "feat: adiciona validação de email"
```

Veja [Convenções de Commits](#convencoes-de-commits).

### 5. Push e Pull Request

```bash
git push origin feature/nome-da-feature
```

Depois, abra um Pull Request no GitHub com:
- **Título claro**: `feat: adiciona validação de email`
- **Descrição detalhada**: O que foi feito e por quê
- **Checklist**: Testes passando, documentação atualizada, etc.

---

## Padrões de Código

### TypeScript

#### Estilo de Código

```typescript
// [OK] CERTO
export class MyCustomNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Custom Node',
    name: 'myCustomNode',
    version: 1,
  };

  async execute(this: INodeExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    return [items];
  }
}

// [X] ERRADO
export class my_custom_node {  // PascalCase obrigatório
  async execute() {             // Sem tipo de retorno
    // código sem tratamento de erro
  }
}
```

#### Princípios

1. **Tipos explícitos**: Sempre defina tipos de retorno
2. **Tratamento de erro**: Use try-catch em operações async
3. **Validação de entrada**: Valide todos os inputs
4. **Naming**: PascalCase para classes, camelCase para variáveis/funções
5. **Comentários**: Documente lógica complexa

### Workflows (JSON)

#### Estrutura Padrão

```json
{
  "name": "ValidarDados",
  "nodes": [
    {
      "id": "webhook-1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "webhookId": "unique-id"
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Validate", "type": "main", "index": 0 }]]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}
```

#### Princípios de Workflows

1. **Responsabilidade Única**: Cada workflow tem um único propósito
2. **Isolamento**: Não depende de estado global
3. **Composição**: Reutiliza sub-workflows
4. **Documentação**: Todo workflow tem `.doc.md` e `.changelog.md`
5. **Versionamento**: Segue Semantic Versioning

---

## Convenções de Nomenclatura

### Workflows

```
{Domain}{Action}{Entity}.json

Exemplos:
[OK] CrmSyncContacts.json
[OK] EmailNotificationOrder.json
[OK] ValidateDataWebhook.json

[X] workflow-1.json
[X] meu_workflow.json
[X] ProcessarTudo.json
```

### Custom Nodes

```
{Provider}{Action}Node.ts

Exemplos:
[OK] SendGridEmailNode.ts
[OK] TwilioSmsNode.ts
[OK] StripePaymentNode.ts

[X] EmailNode.ts (genérico demais)
[X] sendgrid.ts (sem sufixo Node)
```

### Credentials

```
{Provider}Credentials.ts

Exemplos:
[OK] SendGridCredentials.ts
[OK] PostgresCredentials.ts

[X] ApiCredentials.ts (genérico demais)
```

### Variáveis e Funções

```typescript
// [OK] CERTO
const userId = '123';
function validateEmail(email: string): boolean { }
async function fetchUserData(id: string): Promise<User> { }

// [X] ERRADO
const user_id = '123';           // snake_case
function ValidateEmail() { }      // PascalCase em função
async function GetData() { }      // Sem tipo de retorno
```

---

## Commits e Pull Requests

### Convenções de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Tipos

- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação (sem mudança de código)
- `refactor` - Refatoração de código
- `test` - Adição de testes
- `chore` - Manutenção

#### Exemplos

```bash
# Feature
git commit -m "feat(workflows): adiciona workflow de validação de CPF"

# Fix
git commit -m "fix(nodes): corrige bug em SendGridEmailNode"

# Docs
git commit -m "docs(readme): atualiza instruções de instalação"

# Breaking change
git commit -m "feat(workflows): muda formato de input\n\nBREAKING CHANGE: input agora requer campo 'version'"
```

### Template de Pull Request

```markdown
## Descrição
Breve descrição das mudanças.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Todos os testes estão passando
- [ ] Documentação foi atualizada
- [ ] Lint está passando
- [ ] Workflows foram validados

## Como Testar
1. ...
2. ...

## Screenshots (se aplicável)
```

---

## Testes

### Testes Obrigatórios

- **Custom Nodes**: Teste unitário obrigatório
- **Workflows críticos**: Teste de integração obrigatório
- **Funções utilitárias**: Teste unitário obrigatório

### Estrutura de Testes

```typescript
// tests/unit/nodes/MyCustomNode.test.ts
import { MyCustomNode } from '../../../custom-nodes/src/nodes/MyCustomNode';

describe('MyCustomNode', () => {
  let node: MyCustomNode;

  beforeEach(() => {
    node = new MyCustomNode();
  });

  it('deve processar item válido', async () => {
    const input = { json: { email: 'test@example.com' } };
    const result = await node.execute([input]);
    expect(result[0]).toHaveLength(1);
  });

  it('deve rejeitar email inválido', async () => {
    const input = { json: { email: 'invalid' } };
    await expect(node.execute([input])).rejects.toThrow();
  });
});
```

### Rodar Testes

```bash
# Todos os testes
npm test

# Apenas unitários
npm run test:unit

# Com cobertura
npm run test:coverage

# Watch mode (desenvolvimento)
npm run test:watch
```

### Cobertura Mínima

- **Nodes**: 80% de cobertura
- **Utils**: 90% de cobertura
- **Workflows críticos**: Testes de integração obrigatórios

---

## Documentação

### Documentar Workflows

Todo workflow deve ter:

#### 1. Arquivo de Documentação (`{Nome}.doc.md`)

```markdown
# ValidarDados

## Descrição
Valida dados de entrada seguindo regras de negócio.

## Versão
2.1.0

## Input
```json
{
  "email": "string",
  "name": "string",
  "age": "number"
}
```

## Output
```json
{
  "valid": "boolean",
  "errors": "string[]"
}
```

## Fluxo
1. Recebe dados via webhook
2. Valida formato de email
3. Valida idade >= 18
4. Retorna resultado

## Dependências
- Sub-workflow: ValidateEmail
- Credenciais: None

## Autor
Nome - Data
```

#### 2. Changelog (`{Nome}.changelog.md`)

```markdown
# ValidarDados Changelog

## [2.1.0] - 2025-10-30
### Added
- Validação de CPF

### Fixed
- Bug em validação de email

## [2.0.0] - 2025-10-20
### BREAKING CHANGE
- Mudou formato de output
```

### Documentar Custom Nodes

```typescript
/**
 * SendGridEmailNode
 *
 * Node para envio de emails via SendGrid.
 *
 * @version 1.0.0
 * @author Seu Nome
 *
 * @example
 * const node = new SendGridEmailNode();
 * await node.execute([{
 *   json: { to: 'user@example.com', subject: 'Hello' }
 * }]);
 */
export class SendGridEmailNode implements INodeType {
  // ...
}
```

---

## Checklist Antes de Commit

- [ ] Código segue padrões de estilo
- [ ] Testes adicionados/atualizados
- [ ] Todos os testes passando
- [ ] Lint passando
- [ ] Documentação atualizada
- [ ] Workflows validados
- [ ] Commit message segue convenção
- [ ] Branch atualizada com main

---

## Revisão de Código

### O que revisores verificam:

1. **Qualidade de Código**
   - Segue padrões do projeto
   - Sem código duplicado
   - Nomes descritivos

2. **Testes**
   - Cobertura adequada
   - Casos de edge testados

3. **Documentação**
   - Código documentado
   - README atualizado

4. **Segurança**
   - Sem credenciais hardcoded
   - Validação de inputs
   - Tratamento de erros

---

## Dúvidas?

- Abra uma issue com a tag `question`
- Entre em contato com os mantenedores

---

**Obrigado por contribuir!**
