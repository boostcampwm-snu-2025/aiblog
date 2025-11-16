import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  GITHUB_TOKEN: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_CALLBACK_URL: string;
  NODE_ENV: string;
  CLIENT_URL: string;
  OPENAI_API_KEY: string;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key];

  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || defaultValue!;
};

export const env: EnvConfig = {
  PORT: getEnvVariable("PORT", "3000"),
  GITHUB_TOKEN: getEnvVariable("GITHUB_TOKEN"),
  GITHUB_CLIENT_ID: getEnvVariable("GITHUB_CLIENT_ID"),
  GITHUB_CLIENT_SECRET: getEnvVariable("GITHUB_CLIENT_SECRET"),
  GITHUB_CALLBACK_URL: getEnvVariable("GITHUB_CALLBACK_URL"),
  NODE_ENV: getEnvVariable("NODE_ENV", "development"),
  CLIENT_URL: getEnvVariable("CLIENT_URL", "http://localhost:5173"),
  OPENAI_API_KEY: getEnvVariable("OPENAI_API_KEY"),
};
