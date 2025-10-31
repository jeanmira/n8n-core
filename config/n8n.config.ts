/**
 * n8n Configuration
 *
 * Centralized configuration for n8n instance
 */

export interface N8nConfig {
  database: DatabaseConfig;
  security: SecurityConfig;
  execution: ExecutionConfig;
  logging: LoggingConfig;
  timezone: string;
}

export interface DatabaseConfig {
  type: 'postgresdb' | 'mysql' | 'sqlite';
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  schema?: string;
}

export interface SecurityConfig {
  basicAuth: {
    active: boolean;
    user: string;
    password: string;
  };
  encryptionKey: string;
  jwt?: {
    secret: string;
    expiresIn: string;
  };
}

export interface ExecutionConfig {
  process: 'main' | 'queue';
  timeout: number;
  timeoutMax: number;
  saveDataOnError: 'all' | 'none';
  saveDataOnSuccess: 'all' | 'none';
  saveManualExecutions: boolean;
}

export interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  output: string[];
  file?: {
    location: string;
    maxSize: string;
    maxFiles: number;
  };
}

/**
 * Get configuration from environment variables
 */
export function getN8nConfig(): N8nConfig {
  return {
    database: {
      type: (process.env.DB_TYPE as any) || 'postgresdb',
      host: process.env.DB_POSTGRESDB_HOST || 'localhost',
      port: parseInt(process.env.DB_POSTGRESDB_PORT || '5432'),
      database: process.env.DB_POSTGRESDB_DATABASE || 'n8n',
      user: process.env.DB_POSTGRESDB_USER || 'n8n',
      password: process.env.DB_POSTGRESDB_PASSWORD || '',
      schema: process.env.DB_POSTGRESDB_SCHEMA,
    },
    security: {
      basicAuth: {
        active: process.env.N8N_BASIC_AUTH_ACTIVE === 'true',
        user: process.env.N8N_BASIC_AUTH_USER || 'admin',
        password: process.env.N8N_BASIC_AUTH_PASSWORD || '',
      },
      encryptionKey: process.env.N8N_ENCRYPTION_KEY || '',
    },
    execution: {
      process: (process.env.EXECUTIONS_PROCESS as any) || 'main',
      timeout: parseInt(process.env.EXECUTIONS_TIMEOUT || '300'),
      timeoutMax: parseInt(process.env.EXECUTIONS_TIMEOUT_MAX || '3600'),
      saveDataOnError: (process.env.EXECUTIONS_DATA_SAVE_ON_ERROR as any) || 'all',
      saveDataOnSuccess: (process.env.EXECUTIONS_DATA_SAVE_ON_SUCCESS as any) || 'all',
      saveManualExecutions: process.env.EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS === 'true',
    },
    logging: {
      level: (process.env.N8N_LOG_LEVEL as any) || 'info',
      output: (process.env.N8N_LOG_OUTPUT || 'console').split(','),
    },
    timezone: process.env.GENERIC_TIMEZONE || 'America/Sao_Paulo',
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config: N8nConfig): string[] {
  const errors: string[] = [];

  if (!config.database.password) {
    errors.push('Database password is required');
  }

  if (!config.security.encryptionKey) {
    errors.push('Encryption key is required');
  }

  if (config.security.basicAuth.active && !config.security.basicAuth.password) {
    errors.push('Basic auth password is required when basic auth is active');
  }

  if (config.execution.timeout <= 0) {
    errors.push('Execution timeout must be greater than 0');
  }

  return errors;
}
