import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "supabase/functions/**/*", "tas-affiliate-management-system/**/*"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn", // Change from error to warning
      "@typescript-eslint/no-empty-object-type": "off", // Disable for UI components
      "@typescript-eslint/no-require-imports": "off", // Allow require imports
      "react-hooks/exhaustive-deps": "warn", // Change from error to warning
      "no-case-declarations": "off", // Disable for switch cases
      "no-useless-escape": "off", // Disable useless escape warnings
      "prefer-const": "warn", // Change from error to warning
    },
  }
);
