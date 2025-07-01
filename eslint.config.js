import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: [
      'dist',
      '.netlify/**/*',
      '**/deno_dir/**/*',
      '**/edge-functions/**/*',
      '**/functions/**/*',
      'node_modules/**/*',
      '**/*.min.js',
      '**/vendor/**/*'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        React: true,
        JSX: true,
        gtag: 'readonly',
        Netlify: 'readonly',
        Deno: 'readonly',
        AggregateError: 'readonly'
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'no-undef': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': 'off',
      'no-unused-vars': 'off',
      'no-case-declarations': 'off',
      'no-useless-escape': 'off',
      'no-prototype-builtins': 'off',
      'no-empty': 'off'
    },
  },
];