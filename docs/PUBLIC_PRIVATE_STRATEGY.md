# Estratégia: Repositório Público vs Privado

Este documento explica como manter este repositório parte público (portfólio) e parte privado (trabalho real).

## Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    Seu Repositório                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PÚBLICO (GitHub público - Portfólio)                       │
│  ├── Arquitetura e estrutura                                │
│  ├── Documentação                                           │
│  ├── Custom nodes genéricos                                 │
│  ├── Workflows de exemplo                                   │
│  ├── Scripts de automação                                   │
│  └── Configuração CI/CD                                     │
│                                                              │
│  PRIVADO (Git local ou repo privado)                        │
│  ├── Workflows específicos de clientes                      │
│  ├── Credenciais reais (.env)                               │
│  ├── Dados sensíveis                                        │
│  ├── Lógica de negócio proprietária                         │
│  └── Integrações com sistemas internos                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Por que Deixar Público?

### Vantagens para Portfólio

1. **Demonstra habilidades técnicas**
   - Arquitetura limpa e modular
   - TypeScript e testes
   - Docker e CI/CD
   - Documentação profissional

2. **Mostra boas práticas**
   - Clean Architecture
   - Versionamento semântico
   - Testes automatizados
   - Code review process

3. **Networking e oportunidades**
   - Recruiters podem ver seu trabalho
   - Contribuições de outros devs
   - Portfolio vivo e atualizado

4. **Aprendizado comunitário**
   - Outros podem aprender com sua arquitetura
   - Feedback da comunidade
   - Contribuir com open source

## O que DEVE ser Público

### Estrutura e Arquitetura
```
[OK] Estrutura de diretórios
[OK] Documentação (README, ARCHITECTURE, CONTRIBUTING)
[OK] Configuração de CI/CD
[OK] Scripts de automação
[OK] Docker e Kubernetes configs (genéricos)
```

### Código Genérico
```
[OK] Custom nodes de exemplo
[OK] Utilitários (validators, transformers, helpers)
[OK] Workflows de exemplo documentados
[OK] Testes unitários e de integração
[OK] Configurações TypeScript/Jest
```

### Exemplos Educacionais
```
[OK] ValidateData.json - validação de email
[OK] SendEmailNotification.json - envio de email (mock)
[OK] ExampleNode - custom node template
[OK] Validators/Transformers - funções utilitárias
```

## O que NUNCA deve ser Público

### Credenciais e Secrets
```
[X] .env (produção/staging)
[X] credentials.json
[X] API keys reais
[X] Senhas de banco de dados
[X] Tokens de autenticação
```

### Dados Sensíveis
```
[X] Dados de clientes
[X] Informações financeiras
[X] Logs com dados pessoais
[X] Backups de banco de dados
```

### Lógica de Negócio Proprietária
```
[X] Workflows específicos de clientes
[X] Integrações com sistemas internos
[X] Regras de negócio proprietárias
[X] Algoritmos proprietários
```

## Como Gerenciar

### Setup Inicial

#### 1. Repositório Local (Privado)
```bash
# Este é seu repo completo com TUDO
cd /home/parallels/n8n
git init
git add .
git commit -m "Initial commit"
```

#### 2. Repositório Público (Portfólio)
```bash
# Criar repo no GitHub como PÚBLICO
# Adicionar remote
git remote add origin-public https://github.com/seu-usuario/n8n-architecture.git

# Copiar .gitignore.public para .gitignore
cp .gitignore.public .gitignore

# Push apenas arquivos públicos
git add .
git commit -m "feat: adiciona estrutura pública para portfólio"
git push origin-public main
```

#### 3. Repositório Privado (Trabalho Real)
```bash
# Criar repo privado no GitHub
git remote add origin-private https://github.com/seu-usuario/n8n-private.git

# Restaurar .gitignore original (menos restritivo)
git checkout .gitignore

# Push tudo (incluindo workflows privados)
git push origin-private main
```

### Workflow Diário

#### Trabalhando com Workflows Privados
```bash
# Criar workflow privado
vim workflows/private/ClienteXYZ.json

# Commit local ou no repo privado
git add workflows/private/
git commit -m "feat: adiciona workflow ClienteXYZ"
git push origin-private main

# NÃO push para origin-public (ignorado pelo .gitignore)
```

#### Adicionando Features Genéricas
```bash
# Criar custom node genérico
vim custom-nodes/src/nodes/NewGenericNode.ts

# Push para AMBOS repos
git add custom-nodes/
git commit -m "feat: adiciona NewGenericNode"
git push origin-public main
git push origin-private main
```

### Estrutura de Branches Sugerida

```
Repositório Público:
main (stable)
└── develop (novas features públicas)

Repositório Privado:
main (stable)
├── develop (novas features)
├── feature/cliente-xyz (trabalho de cliente)
└── hotfix/bug-production (correções urgentes)
```

## Checklist Antes de Push Público

Antes de fazer `git push origin-public main`, verifique:

- [ ] Nenhum `.env` ou credenciais reais
- [ ] Nenhum dado de cliente
- [ ] Nenhuma URL/IP de produção
- [ ] Nenhum secret hardcoded
- [ ] Documentação está atualizada
- [ ] README tem instruções claras
- [ ] PORTFOLIO.md está atualizado
- [ ] Workflows privados em workflows/private/

## Comandos Úteis

### Ver o que será commitado no repo público
```bash
# Simular o que .gitignore.public bloquearia
git status --ignored
```

### Verificar se há secrets
```bash
# Buscar possíveis secrets
grep -r "password\|secret\|token\|key" --include="*.json" --include="*.ts" workflows/
```

### Limpar histórico se commitou secret acidentalmente
```bash
# CUIDADO: Reescreve história do Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch workflows/private/secret.json" \
  --prune-empty --tag-name-filter cat -- --all
```

## Exemplo de .gitignore para Repo Público

Está em `.gitignore.public`:
```bash
# Bloqueia workflows privados
workflows/private/
workflows/**/*-private.json

# Bloqueia env real
.env
.env.production

# Permite apenas exemplos
!.env.example
```

## FAQs

### Q: Posso ter dois remotes no mesmo repo local?
**A:** Sim! Um repo local pode ter múltiplos remotes (origin-public e origin-private).

### Q: Como sincronizar mudanças genéricas entre repos?
**A:** Commit na branch develop, depois merge para main e push para ambos os remotes.

### Q: E se eu acidentalmente commitar um secret no repo público?
**A:** Use `git filter-branch` ou GitHub's secret scanning. Melhor: regenere o secret imediatamente.

### Q: Devo deixar o .gitignore.public versionado?
**A:** Sim! Assim você tem histórico das regras e pode voltar se necessário.

## Exemplo Prático

### Cenário 1: Novo Custom Node Genérico
```bash
# 1. Criar node
vim custom-nodes/src/nodes/NewNode.ts

# 2. Testar
npm test

# 3. Documentar
vim custom-nodes/README.md

# 4. Commit
git add custom-nodes/
git commit -m "feat: adiciona NewNode"

# 5. Push para AMBOS
git push origin-public main
git push origin-private main
```

### Cenário 2: Workflow Específico de Cliente
```bash
# 1. Criar workflow privado
vim workflows/private/ClientABC-Process.json

# 2. Adicionar doc privada
vim workflows/private/ClientABC-Process.doc.md

# 3. Commit
git add workflows/private/
git commit -m "feat: adiciona workflow ClientABC"

# 4. Push APENAS privado
git push origin-private main
# (origin-public ignora workflows/private/ automaticamente)
```

### Cenário 3: Atualizar Documentação Pública
```bash
# 1. Editar docs
vim README.md
vim docs/ARCHITECTURE.md

# 2. Commit
git add README.md docs/
git commit -m "docs: atualiza README com novos exemplos"

# 3. Push para AMBOS
git push origin-public main
git push origin-private main
```

## Recomendação Final

**Estratégia recomendada:**

1. **Mantenha um repo local completo** com tudo (privado + público)
2. **Configure dois remotes:**
   - `origin-public` → GitHub público (portfólio)
   - `origin-private` → GitHub privado ou GitLab/Bitbucket
3. **Use .gitignore.public quando for push para público**
4. **Sempre revise antes de push público**: `git diff origin-public/main`

Desta forma você tem:
- Portfólio público demonstrando skills
- Trabalho real protegido e privado
- Controle total sobre o que é compartilhado
- Histórico completo em ambos os repos

---

**Autor:** Jean Mira
**Data:** 2025-10-30
