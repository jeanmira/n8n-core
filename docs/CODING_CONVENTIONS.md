# Coding Conventions

## Language Standards

### Code: Portuguese or English (Your Choice)
Você pode escrever código em **português** ou **inglês**, como preferir:

```typescript
// ✅ OK - Português
function validarEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ OK - English
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

**Recomendações:**
- **Português**: Mais natural se você trabalha sozinho ou com time brasileiro
- **Inglês**: Melhor para projetos open source ou times internacionais
- **Consistência**: Escolha um idioma e mantenha em todo o projeto

**Applies to:**
- Variable names (nomes de variáveis)
- Function names (nomes de funções)
- Class names (nomes de classes)
- Interface names (nomes de interfaces)
- Type names (nomes de tipos)
- File names (nomes de arquivos)
- Comments in code (comentários)

### Commit Messages: Your Choice
```bash
# ✅ OK - Português
git commit -m "feat: adiciona validação de email"
git commit -m "fix: corrige tratamento de timeout"

# ✅ OK - English
git commit -m "feat: add email validation"
git commit -m "fix: correct timeout handling"
```

### Documentation: Portuguese or English
Documentação pode ser em português ou inglês:
- README.md
- ARCHITECTURE.md
- Workflow documentation (.doc.md)
- Comments

## Naming Conventions

### Files (Português ou Inglês)
```
✅ ValidarDados.json
✅ EnviarEmailNotificacao.json
✅ ValidateData.json
✅ SendEmailNotification.json
```

### Functions and Variables (Português ou Inglês)
```typescript
// ✅ OK - Português
const nomeUsuario: string;
function buscarUsuarioPorId(id: string): Usuario;
class ServicoEmail { }
interface IRepositorioUsuario { }

// ✅ OK - English
const userName: string;
function getUserById(id: string): User;
class EmailService { }
interface IUserRepository { }
```

### Constants (Português ou Inglês)
```typescript
// ✅ OK - Português
const MAX_TENTATIVAS = 3;
const TIMEOUT_PADRAO = 5000;
const URL_BASE_API = 'https://api.example.com';

// ✅ OK - English
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;
const API_BASE_URL = 'https://api.example.com';
```

### Classes and Interfaces (Português ou Inglês)
```typescript
// ✅ OK - Português
class ServicoUsuario { }
interface IProvedorEmail { }
type ResultadoValidacao = { };

// ✅ OK - English
class UserService { }
interface IEmailProvider { }
type ValidationResult = { };
```

## Comments

### Code Comments: Português ou English
```typescript
// ✅ OK - Português
/**
 * Valida se o email dado tem formato válido
 * @param email - Endereço de email para validar
 * @returns true se válido, false caso contrário
 */
function validarEmail(email: string): boolean {
  // Verifica formato do email usando regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ OK - English
/**
 * Validates if the given email has a valid format
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
function validateEmail(email: string): boolean {
  // Check email format using regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Workflow Documentation: Português ou English
```markdown
# ValidarDados

Workflow para validação de dados recebidos via webhook.

## Descrição
Este workflow recebe dados via webhook e valida o formato do email.
```

## Git Conventions

### Commit Messages: Português ou English
```bash
# ✅ OK - Português
git commit -m "feat: adiciona validação de email"
git commit -m "fix: corrige tratamento de timeout"
git commit -m "docs: atualiza README"

# ✅ OK - English
git commit -m "feat: add email validation"
git commit -m "fix: correct timeout handling"
git commit -m "docs: update README"
```

### Branch Names: Português ou English
```bash
# ✅ OK - Português
feature/autenticacao-usuario
fix/bug-validacao-email
refactor/camada-banco

# ✅ OK - English
feature/user-authentication
fix/email-validation-bug
refactor/database-layer
```

## TypeScript Conventions

### Types (Português ou English)
```typescript
// ✅ OK - Português
type Usuario = {
  id: string;
  nome: string;
  email: string;
  criadoEm: Date;
};

interface IRepositorioUsuario {
  buscarPorId(id: string): Promise<Usuario>;
  criar(usuario: Usuario): Promise<void>;
  atualizar(usuario: Usuario): Promise<void>;
  deletar(id: string): Promise<void>;
}

// ✅ OK - English
type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

interface IUserRepository {
  findById(id: string): Promise<User>;
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### Enums (Português ou English)
```typescript
// ✅ OK - Português
enum PapelUsuario {
  Admin = 'admin',
  Usuario = 'usuario',
  Convidado = 'convidado',
}

enum StatusPedido {
  Pendente = 'pendente',
  Processando = 'processando',
  Completo = 'completo',
  Cancelado = 'cancelado',
}

// ✅ OK - English
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Cancelled = 'cancelled',
}
```

## User-Facing Content

Conteúdo voltado para usuários pode estar em português:

```typescript
// ✅ Mensagens de erro para usuários
throw new Error('Email inválido. Por favor, verifique o formato.');

// ✅ Mensagens de validação
const mensagensValidacao = {
  obrigatorio: 'Campo obrigatório',
  emailInvalido: 'Email inválido',
  tamanhoMinimo: 'Tamanho mínimo não atingido',
};
```

## Quando Usar Português vs Inglês?

### Use Português se:
- Você trabalha sozinho ou com time brasileiro
- O projeto é interno e não será compartilhado
- Você se sente mais confortável em português
- Os usuários finais são brasileiros

### Use Inglês se:
- Projeto open source ou público
- Time internacional
- Quer praticar inglês técnico
- Planeja compartilhar código como portfólio

### Seja Consistente
Escolha um idioma e mantenha em todo o projeto. Não misture português e inglês no mesmo arquivo.

## Checklist

Antes de commitar código, verifique:

- [ ] Código está consistente no idioma escolhido
- [ ] Nomes de variáveis/funções seguem padrão
- [ ] Comentários estão claros
- [ ] Documentação está atualizada
- [ ] Commit message segue convenção (feat/fix/docs)
- [ ] Testes estão passando

---

**Author:** Jean Mira
**Date:** 2025-10-30
