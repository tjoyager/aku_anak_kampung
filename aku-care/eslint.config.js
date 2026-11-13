import tsParser from '@typescript-eslint/parser';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  jsxA11y.flatConfigs.recommended,
  {
    files: ['src/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
];
