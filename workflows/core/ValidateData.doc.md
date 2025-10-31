# ValidateData

Workflow para validação de dados recebidos via webhook.

## Versão
1.0.0

## Descrição
Este workflow recebe dados via webhook, valida o email informado e retorna uma resposta indicando se o email é válido ou não.

## Input

**Método:** POST
**Path:** `/webhook/validate`

```json
{
  "email": "string",
  "name": "string (opcional)"
}
```

### Exemplo de Input
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

## Output

### Sucesso (email válido)
```json
{
  "status": "success",
  "message": "Email is valid",
  "data": {
    "email": "user@example.com",
    "name": "John Doe",
    "emailValid": true,
    "validatedAt": "2025-10-30T10:00:00.000Z"
  }
}
```

### Erro (email inválido)
```json
{
  "status": "error",
  "message": "Email is invalid",
  "data": {
    "email": "invalid-email",
    "emailValid": false,
    "validatedAt": "2025-10-30T10:00:00.000Z"
  }
}
```

## Fluxo

1. **Webhook** - Recebe dados via POST
2. **Validate Email** - Valida formato do email usando regex
3. **Check Validity** - Verifica se email é válido
4. **Respond Success/Error** - Retorna resposta apropriada

## Dependências

Nenhuma dependência externa.

## Credenciais

Nenhuma credencial necessária.

## Casos de Uso

- Validação de formulários
- API de validação de dados
- Pre-processamento de dados

## Testes

```bash
curl -X POST http://localhost:5678/webhook/validate \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

## Autor

Jean Mira - 2025-10-30
