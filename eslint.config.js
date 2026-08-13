// ESLint v10 flat config.
// The @angular-eslint packages installed here only ship `rules`, so the Angular
// rule set is declared explicitly instead of extending a shared preset.
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const templateParser = require('@angular-eslint/template-parser');

module.exports = [
  {
    ignores: ['dist/**', '.angular/**', 'node_modules/**', 'coverage/**', 'public/**'],
  },
  ...tsPlugin.configs['flat/recommended'].map(config => ({
    ...config,
    files: ['src/**/*.ts'],
  })),
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@angular-eslint': angularPlugin,
    },
    rules: {
      // NEXO uses two selector prefixes: `nx` for the shared design-system
      // primitives and `app` for feature-level components.
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: ['app', 'nx'], style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: ['app', 'nx'], style: 'camelCase' },
      ],
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/use-lifecycle-interface': 'warn',
      '@angular-eslint/prefer-standalone': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  {
    // Motion directives keep their bare, spec-named selectors (`scrollReveal`,
    // `magnetic`, `parallax`, …) because they read as behaviour modifiers.
    files: ['src/app/shared/motion/**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': 'off',
    },
  },
  {
    files: ['src/**/*.html'],
    languageOptions: {
      parser: templateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/eqeqeq': 'warn',
    },
  },
];
