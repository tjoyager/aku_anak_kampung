import js from "@eslint/js";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      // Pastikan semua elemen interaktif punya label
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/no-autofocus": "off",
      // TypeScript rules: longgarkan any sementara
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
