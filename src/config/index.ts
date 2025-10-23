import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface Config {
  parsely: {
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
  };
  server: {
    port: number;
  };
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export function loadConfig(): Config {
  return {
    parsely: {
      apiKey: getRequiredEnv('PARSELY_API_KEY'),
      apiSecret: getRequiredEnv('PARSELY_API_SECRET'),
      baseUrl: getOptionalEnv('PARSELY_API_BASE_URL', 'https://api.parse.ly/v2'),
    },
    server: {
      port: parseInt(getOptionalEnv('PORT', '3000'), 10),
    },
  };
}

// Validate configuration on module load (fail fast)
export const config = loadConfig();
