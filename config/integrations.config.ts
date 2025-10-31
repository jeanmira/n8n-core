/**
 * External Integrations Configuration
 *
 * Centralized configuration for external services and APIs
 */

export interface IntegrationsConfig {
  email: EmailConfig;
  messaging: MessagingConfig;
  payment: PaymentConfig;
  ai: AIConfig;
  cloud: CloudConfig;
}

export interface EmailConfig {
  sendgrid?: {
    apiKey: string;
    defaultFrom: string;
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
  };
}

export interface MessagingConfig {
  slack?: {
    botToken: string;
    webhookUrl?: string;
  };
  twilio?: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
  };
  whatsapp?: {
    apiKey: string;
    phoneNumberId: string;
  };
}

export interface PaymentConfig {
  stripe?: {
    apiKey: string;
    webhookSecret: string;
  };
  paypal?: {
    clientId: string;
    clientSecret: string;
    mode: 'sandbox' | 'production';
  };
}

export interface AIConfig {
  openai?: {
    apiKey: string;
    organization?: string;
    model: string;
  };
  anthropic?: {
    apiKey: string;
  };
}

export interface CloudConfig {
  aws?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  gcp?: {
    projectId: string;
    credentials: string;
  };
  azure?: {
    subscriptionId: string;
    tenantId: string;
    clientId: string;
    clientSecret: string;
  };
}

/**
 * Get integrations configuration from environment variables
 */
export function getIntegrationsConfig(): IntegrationsConfig {
  return {
    email: {
      sendgrid: process.env.SENDGRID_API_KEY ? {
        apiKey: process.env.SENDGRID_API_KEY,
        defaultFrom: process.env.SENDGRID_FROM || 'noreply@example.com',
      } : undefined,
      smtp: process.env.SMTP_HOST ? {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER || '',
        password: process.env.SMTP_PASSWORD || '',
        from: process.env.SMTP_FROM || 'noreply@example.com',
      } : undefined,
    },
    messaging: {
      slack: process.env.SLACK_BOT_TOKEN ? {
        botToken: process.env.SLACK_BOT_TOKEN,
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
      } : undefined,
      twilio: process.env.TWILIO_ACCOUNT_SID ? {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN || '',
        phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
      } : undefined,
    },
    payment: {
      stripe: process.env.STRIPE_API_KEY ? {
        apiKey: process.env.STRIPE_API_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      } : undefined,
    },
    ai: {
      openai: process.env.OPENAI_API_KEY ? {
        apiKey: process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORGANIZATION,
        model: process.env.OPENAI_MODEL || 'gpt-4',
      } : undefined,
    },
    cloud: {
      aws: process.env.AWS_ACCESS_KEY_ID ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        region: process.env.AWS_REGION || 'us-east-1',
      } : undefined,
    },
  };
}

/**
 * Check if integration is configured
 */
export function isIntegrationConfigured(service: string): boolean {
  const config = getIntegrationsConfig();

  const serviceMap: Record<string, any> = {
    sendgrid: config.email.sendgrid,
    smtp: config.email.smtp,
    slack: config.messaging.slack,
    twilio: config.messaging.twilio,
    stripe: config.payment.stripe,
    openai: config.ai.openai,
    aws: config.cloud.aws,
  };

  return !!serviceMap[service];
}

/**
 * Get configured integrations list
 */
export function getConfiguredIntegrations(): string[] {
  const config = getIntegrationsConfig();
  const configured: string[] = [];

  if (config.email.sendgrid) configured.push('sendgrid');
  if (config.email.smtp) configured.push('smtp');
  if (config.messaging.slack) configured.push('slack');
  if (config.messaging.twilio) configured.push('twilio');
  if (config.payment.stripe) configured.push('stripe');
  if (config.ai.openai) configured.push('openai');
  if (config.cloud.aws) configured.push('aws');

  return configured;
}
