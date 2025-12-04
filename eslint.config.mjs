import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

module.exports = [
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      eslintConfigPrettier,
    ],
    ignorePatterns: [".github/workflows", "node_modules", "dist"], // Ignore specific files/folders
  },
  {
    // Configuration for specific files (e.g., customize rules for TypeScript files)
    files: ["*.ts", "*.tsx"],
    rules: {
      "no-console": "off", // Example: Turn off specific rule for TypeScript files
      "no-unused-vars": "off", // Example: Turn off another rule for TypeScript files
    },
  },
];
