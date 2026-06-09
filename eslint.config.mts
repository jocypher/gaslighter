import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, "unused-imports": unusedImports },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node,
    },
  },

  tseslint.configs.recommended,

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",

      "unused-imports/no-unused-imports": "off",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      "no-console": "off",
    },
  },
]);