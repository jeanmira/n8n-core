# Coding Conventions

## Language Standards

### Code: ALWAYS English
All code must be written in English:

```typescript
// ✅ CORRECT - English
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ❌ WRONG - Portuguese
function validarEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

**Applies to:**
- Variable names
- Function names
- Class names
- Interface names
- Type names
- File names
- Comments in code
- Commit messages
- Branch names

### Documentation: Portuguese OK
Documentation can be in Portuguese:
- README.md sections
- ARCHITECTURE.md explanations
- User-facing documentation
- Workflow documentation (.doc.md files)

But technical documentation should prefer English for wider audience.

## Naming Conventions

### Files
```
✅ ValidateData.json
✅ SendEmailNotification.json
✅ ExampleNode.node.ts
✅ UserService.ts

❌ ValidarDados.json
❌ EnviarEmailNotificacao.json
```

### Functions and Variables
```typescript
// ✅ CORRECT
const userName: string;
function getUserById(id: string): User;
class EmailService { }
interface IUserRepository { }

// ❌ WRONG
const nomeUsuario: string;
function buscarUsuarioPorId(id: string): User;
class ServicoEmail { }
interface IRepositorioUsuario { }
```

### Constants
```typescript
// ✅ CORRECT
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;
const API_BASE_URL = 'https://api.example.com';

// ❌ WRONG
const MAX_TENTATIVAS = 3;
const TIMEOUT_PADRAO = 5000;
const URL_BASE_API = 'https://api.example.com';
```

### Classes and Interfaces
```typescript
// ✅ CORRECT
class UserService { }
interface IEmailProvider { }
type ValidationResult = { };

// ❌ WRONG
class ServicoUsuario { }
interface IProvedorEmail { }
type ResultadoValidacao = { };
```

## Comments

### Code Comments: English
```typescript
// ✅ CORRECT
/**
 * Validates if the given email has a valid format
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
function validateEmail(email: string): boolean {
  // Check email format using regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ❌ WRONG
/**
 * Valida se o email dado tem formato válido
 * @param email - Endereço de email para validar
 * @returns true se válido, false caso contrário
 */
function validateEmail(email: string): boolean {
  // Verifica formato do email usando regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Workflow Documentation: Portuguese OK
```markdown
# ValidateData

Workflow para validação de dados recebidos via webhook.

## Description
This workflow receives data via webhook and validates the email format.

(Portuguese OK here for user-facing docs)
```

## Git Conventions

### Commit Messages: English
```bash
# ✅ CORRECT
git commit -m "feat: add email validation"
git commit -m "fix: correct timeout handling"
git commit -m "docs: update README"

# ❌ WRONG
git commit -m "feat: adiciona validação de email"
git commit -m "fix: corrige tratamento de timeout"
git commit -m "docs: atualiza README"
```

### Branch Names: English
```bash
# ✅ CORRECT
feature/user-authentication
fix/email-validation-bug
refactor/database-layer

# ❌ WRONG
feature/autenticacao-usuario
fix/bug-validacao-email
refactor/camada-banco
```

## TypeScript Conventions

### Types
```typescript
// ✅ CORRECT
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

// ❌ WRONG
type Usuario = {
  id: string;
  nome: string;
  email: string;
  criadoEm: Date;
};
```

### Enums
```typescript
// ✅ CORRECT
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

// ❌ WRONG
enum PapelUsuario {
  Admin = 'admin',
  Usuario = 'usuario',
  Convidado = 'convidado',
}
```

## Exception: User-Facing Content

User-facing content CAN be in Portuguese if the target audience is Brazilian:

```typescript
// ✅ ACCEPTABLE - Error messages for users
throw new Error('Email inválido. Por favor, verifique o formato.');

// ✅ ACCEPTABLE - Validation messages
const validationMessages = {
  required: 'Campo obrigatório',
  invalidEmail: 'Email inválido',
  minLength: 'Tamanho mínimo não atingido',
};

// But variable names still in English
const userErrorMessages = { ... };
```

## Why English?

1. **International Standard**: Programming languages use English
2. **Team Collaboration**: Easier for international teams
3. **Code Reusability**: Can be shared globally
4. **Learning**: Aligns with documentation and resources
5. **Professionalism**: Shows adherence to industry standards

## Checklist

Before committing code, verify:

- [ ] All variable names in English
- [ ] All function names in English
- [ ] All class/interface names in English
- [ ] All file names in English
- [ ] All code comments in English
- [ ] Commit message in English
- [ ] Branch name in English

---

**Author:** Jean Mira
**Date:** 2025-10-30
