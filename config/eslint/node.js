import { defineConfig } from "eslint/config";
import globals from "globals";
import baseConfig from "./base.js";

export default defineConfig([
  ...baseConfig,
  {
    files: ["**/*.{js,cjs,mjs,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
]);
