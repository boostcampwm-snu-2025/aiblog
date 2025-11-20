import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 로드
dotenv.config({ path: join(__dirname, "../../.env") });

interface Config {
  github: {
    token: string;
  };
  gemini: {
    apiKey: string;
  };
  server: {
    port: number;
    clientUrl: string;
  };
}

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
        `Please check your .env file and ensure ${key} is set.`
    );
  }

  return value;
};

export const config: Config = {
  github: {
    token: getEnv("GITHUB_TOKEN"),
  },
  gemini: {
    apiKey: getEnv("GEMINI_API_KEY"),
  },
  server: {
    port: parseInt(getEnv("PORT", "5000")),
    clientUrl: getEnv("CLIENT_URL"),
  },
};
