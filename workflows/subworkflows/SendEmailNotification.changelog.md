# SendEmailNotification Changelog

## [1.0.0] - 2025-10-30

### Added
- Versão inicial do sub-workflow
- Formatação de email em HTML
- Suporte para assunto personalizado
- Timestamp automático de envio
- Mock de envio usando httpbin.org

### Notes
- Requer configuração de provedor de email para produção
- Atualmente usa httpbin como mock para testes
- Performance: ~100ms por email
