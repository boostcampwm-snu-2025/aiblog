import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const TYPESCRIPT_CONFIGS = tseslint.configs.recommended;

export default defineConfig([
  globalIgnores([
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.vite/**",
  ]),
  {
    files: ["**/*.{js,cjs,mjs,jsx,ts,tsx}"],
    ignores: ["**/*.d.ts"],
    extends: [js.configs.recommended, ...TYPESCRIPT_CONFIGS,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
    },
  },
]);
