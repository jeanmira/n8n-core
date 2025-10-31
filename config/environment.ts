/**
 * Environment Configuration
 *
 * Manages environment-specific settings
 */

export type Environment = 'development' | 'staging' | 'production' | 'test';

export interface EnvironmentConfig {
  env: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  isStaging: boolean;
  debug: boolean;
  port: number;
  host: string;
}

/**
 * Get current environment
 */
export function getEnvironment(): Environment {
  const env = process.env.NODE_ENV || 'development';

  if (['development', 'staging', 'production', 'test'].includes(env)) {
    return env as Environment;
  }

  return 'development';
}

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = getEnvironment();

  return {
    env,
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    isTest: env === 'test',
    isStaging: env === 'staging',
    debug: process.env.DEBUG === 'true' || env === 'development',
    port: parseInt(process.env.N8N_PORT || '5678'),
    host: process.env.N8N_HOST || 'localhost',
  };
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(): string[] {
  const errors: string[] = [];
  const env = getEnvironment();

  const requiredVars: Record<Environment, string[]> = {
    development: [
      'POSTGRES_USER',
      'POSTGRES_PASSWORD',
      'POSTGRES_DB',
    ],
    staging: [
      'POSTGRES_USER',
      'POSTGRES_PASSWORD',
      'POSTGRES_DB',
      'N8N_ENCRYPTION_KEY',
      'N8N_BASIC_AUTH_PASSWORD',
    ],
    production: [
      'POSTGRES_USER',
      'POSTGRES_PASSWORD',
      'POSTGRES_DB',
      'N8N_ENCRYPTION_KEY',
      'N8N_BASIC_AUTH_USER',
      'N8N_BASIC_AUTH_PASSWORD',
      'N8N_HOST',
      'WEBHOOK_URL',
    ],
    test: [
      'POSTGRES_USER',
      'POSTGRES_PASSWORD',
      'POSTGRES_DB',
    ],
  };

  const required = requiredVars[env] || [];

  for (const varName of required) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  return errors;
}

/**
 * Get database URL for current environment
 */
export function getDatabaseUrl(): string {
  const user = process.env.POSTGRES_USER || 'n8n';
  const password = process.env.POSTGRES_PASSWORD || '';
  const host = process.env.DB_POSTGRESDB_HOST || 'localhost';
  const port = process.env.DB_POSTGRESDB_PORT || '5432';
  const database = process.env.POSTGRES_DB || 'n8n';

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

/**
 * Load environment variables from .env file
 */
export function loadEnvironment(): void {
  try {
    require('dotenv').config();
  } catch (error) {
    console.warn('dotenv not installed or .env file not found');
  }
}

/**
 * Print environment info (for debugging)
 */
export function printEnvironmentInfo(): void {
  const config = getEnvironmentConfig();

  console.log('='.repeat(50));
  console.log('Environment Configuration');
  console.log('='.repeat(50));
  console.log(`Environment: ${config.env}`);
  console.log(`Debug: ${config.debug}`);
  console.log(`Host: ${config.host}`);
  console.log(`Port: ${config.port}`);
  console.log('='.repeat(50));
}
