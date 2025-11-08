import { defineConfig } from "eslint/config";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import baseConfig from "./base.js";

export default defineConfig([
  ...baseConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    settings: {
        react: {
            version: 'detect',
        }
    },
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...globals.browser,
      },
    },
  },
]);
