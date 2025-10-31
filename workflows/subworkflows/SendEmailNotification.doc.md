# SendEmailNotification

Sub-workflow reutilizável para envio de notificações por email.

## Versão
1.0.0

## Descrição
Este sub-workflow pode ser chamado por outros workflows para enviar emails formatados. Ele prepara os dados, formata o HTML e envia o email.

## Input

```json
{
  "to": "string (obrigatório)",
  "subject": "string (opcional)",
  "body": "string (obrigatório)"
}
```

### Exemplo de Input
```json
{
  "to": "user@example.com",
  "subject": "Welcome!",
  "body": "Thank you for signing up."
}
```

## Output

```json
{
  "to": "user@example.com",
  "subject": "Welcome!",
  "body": "Thank you for signing up.",
  "htmlBody": "<html>...</html>",
  "sentAt": "2025-10-30T10:00:00.000Z",
  "status": "sent"
}
```

## Fluxo

1. **Execute Workflow Trigger** - Recebe chamada de outro workflow
2. **Prepare Email Data** - Prepara dados do email
3. **Format Email** - Formata email em HTML
4. **Send Email** - Envia email (atualmente usando mock)

## Dependências

- HTTP Request node para envio

## Credenciais

Para produção, configure:
- SendGrid API
- SMTP credentials
- Ou outro provedor de email

## Como Usar em Outro Workflow

1. Adicione node "Execute Workflow"
2. Selecione "SendEmailNotification"
3. Passe os dados necessários

## Exemplo de Chamada

```json
{
  "to": "customer@example.com",
  "subject": "Order Confirmation",
  "body": "Your order #12345 has been confirmed."
}
```

## Notas

- Atualmente usa httpbin.org para mock
- Para produção, substitua por SendGrid ou SMTP real
- Suporta HTML personalizado
- Adiciona timestamp automaticamente

## Autor

Jean Mira - 2025-10-30
