import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

// Define your ESLint configuration using ES Modules syntax
export default defineConfig([
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      eslintConfigPrettier,
    ],
  },
  {
    // Configuration for specific files (e.g., ignore specific folders)
    files: [".github/workflows", "node_modules", ".dist"],
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
    },
  },
]);
