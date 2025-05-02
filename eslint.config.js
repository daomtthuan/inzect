import ESLint from '@eslint/js';
import JSDocESLint from 'eslint-plugin-jsdoc';
import PrettierESLint from 'eslint-plugin-prettier/recommended';
import Globals from 'globals';
import TSEslint from 'typescript-eslint';

export default TSEslint.config(
  {
    ignores: [
      // Packages
      '**/node_modules/**/*',
      // Build
      '**/dist/**/*',
      // Configs
      '**/*.config.js',
    ],
  },
  {
    languageOptions: {
      globals: Globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ESLint.configs.recommended,
  TSEslint.configs.recommended,
  JSDocESLint.configs['flat/recommended-typescript'],
  {
    rules: {
      // Off
      'require-await': 'off',

      // Warn
      'complexity': ['warn', { variant: 'modified' }],
      'max-depth': 'warn',
      'arrow-body-style': ['error', 'as-needed'],
      '@typescript-eslint/typedef': ['warn', { parameter: true }],
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/explicit-module-boundary-types': ['warn'],
      '@typescript-eslint/explicit-member-accessibility': ['warn'],
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: {
            ancestorsOnly: true,
            esm: true,
            cjs: true,
            window: true,
          },
          exemptEmptyConstructors: true,
          require: {
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
          contexts: ['TSTypeAliasDeclaration', 'TSInterfaceDeclaration', 'TSMethodSignature', 'TSPropertySignature', 'VariableDeclaration'],
        },
      ],
      'jsdoc/require-param': ['warn', { checkDestructured: false }],
      'jsdoc/require-returns': ['warn', { contexts: ['FunctionDeclaration', 'FunctionExpression'] }],
      'jsdoc/check-param-names': ['warn', { checkDestructured: false }],
      'jsdoc/tag-lines': ['warn', 'always', { count: 0, startLines: 1 }],

      // Error
      'no-promise-executor-return': 'error',
      'prefer-promise-reject-errors': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'with-single-extends',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
    },
  },
  PrettierESLint,
);
