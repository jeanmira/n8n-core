# ValidateData Changelog

Todas as mudanças notáveis neste workflow serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-30

### Added
- Versão inicial do workflow
- Validação de email via regex
- Resposta diferenciada para sucesso/erro
- Documentação completa

### Example Usage
```bash
curl -X POST http://localhost:5678/webhook/validate \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Notes
- Usa regex padrão para validação de email
- Não verifica se domínio existe
- Performance: ~10ms por requisição
