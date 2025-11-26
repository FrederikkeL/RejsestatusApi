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
  overrides: [
    // Ignore a specific folder (recursively)
    {
      files: [".github\workflows", "node_modules"],
      rules: {
        // Disable all rules for this folder
        "no-console": "off",
        "no-unused-vars": "off",
      },
    },
  ],
});