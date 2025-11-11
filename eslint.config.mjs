// @ts-check
// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

// Define your ESLint configuration using ES Modules syntax
export default defineConfig({
  extends: [
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    eslintConfigPrettier,
  ],
});

