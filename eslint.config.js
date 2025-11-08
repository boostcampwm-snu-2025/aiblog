import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginQuery from "@tanstack/eslint-plugin-query";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "@tanstack/query": pluginQuery,
      import: importPlugin,
    },
    rules: {
      "no-console": ["off"],
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "CallExpression[callee.object.name='console'][callee.property.name=/^(log|warn|error|info|trace|debug)$/]",
          message: "로그 출력이 필요할 경우 customConsole 객체를 사용하세요 `/src/utils/console.ts`",
        },
      ],
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external", // 외부 패키지
            "internal", // @/ 절대경로
            ["parent", "sibling", "index"], // 상대경로
          ],
          pathGroups: [
            { pattern: "{react,react-*,react-*/**}", group: "builtin", position: "before" }, // react는 builtin으로 별도 지정
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          "newlines-between": "always-and-inside-groups",
          pathGroupsExcludedImportTypes: ["react"], // react는 external에서 제외
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
]);
