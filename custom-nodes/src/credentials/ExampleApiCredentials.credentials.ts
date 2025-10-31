/**
 * ExampleApiCredentials
 *
 * Credenciais de exemplo para API externa.
 *
 * @version 1.0.0
 */

import {
  ICredentialType,
  INodeProperties,
  ICredentialTestRequest,
  IAuthenticateGeneric,
} from 'n8n-workflow';

export class ExampleApiCredentials implements ICredentialType {
  name = 'exampleApiCredentials';
  displayName = 'Example API Credentials';
  documentationUrl = 'https://docs.example.com/api';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'API Key para autenticação',
    },
    {
      displayName: 'API Secret',
      name: 'apiSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: false,
      description: 'API Secret (opcional)',
    },
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Production',
          value: 'production',
        },
        {
          name: 'Staging',
          value: 'staging',
        },
        {
          name: 'Development',
          value: 'development',
        },
      ],
      default: 'production',
      description: 'Ambiente da API',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.example.com',
      required: true,
      description: 'URL base da API',
      placeholder: 'https://api.example.com',
    },
  ];

  // Autenticação automática
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'Authorization': '=Bearer {{$credentials.apiKey}}',
        'X-API-Secret': '={{$credentials.apiSecret}}',
      },
    },
  };

  // Teste de credenciais
  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/health',
      method: 'GET',
    },
  };
}
