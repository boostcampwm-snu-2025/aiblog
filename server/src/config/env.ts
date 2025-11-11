import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  github: {
    token: process.env.GITHUB_TOKEN || '',
  },

  llm: {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  },

  database: {
    url: process.env.DATABASE_URL || '',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
} as const;

// Validate required environment variables
export function validateEnv(): void {
  const isDevelopment = config.nodeEnv === 'development';

  if (!config.github.token && !isDevelopment) {
    console.warn('Warning: GITHUB_TOKEN is not set');
  }

  if (!config.llm.openaiApiKey && !config.llm.geminiApiKey && !isDevelopment) {
    console.warn('Warning: Neither OPENAI_API_KEY nor GEMINI_API_KEY is set');
  }
}
