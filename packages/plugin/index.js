import eslint from '@eslint/js'
import markdown from '@eslint/markdown'
import pluginJest from 'eslint-plugin-jest'
import nodePlugin from 'eslint-plugin-n'
import packageJson from 'eslint-plugin-package-json'
import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintPluginYml from 'eslint-plugin-yml'
import tseslint from 'typescript-eslint'

// @ts-ignore
const tsconfigUri = '../plugin-tsconfig/src/index.ts'
const tsconfigPlugin = await import(tsconfigUri)

// @ts-ignore
const actionsUri = '../plugin-github-actions/src/index.ts'
const actionsPlugin = await import(actionsUri)

const root = process.cwd()

/**
 * @type {any}
 */
const defaultConfig = tseslint.config(
  {
    files: ['**/*.ts'],
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          newlinesBetween: 'never',
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      {
        languageOptions: {
          parserOptions: {
            projectService: true,
            tsconfigRootDir: root,
          },
        },
      },
    ],
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': [
        'error',
        {
          allow: [
            { from: 'lib', name: 'Uint8Array' },
            { from: 'lib', name: 'Uint32Array' },
            { from: 'lib', name: 'RegExp' },
            { from: 'lib', name: 'MessagePort' },
            { from: 'lib', name: 'FileList' },
            { from: 'lib', name: 'Response' },
            { from: 'lib', name: 'Error' },
            { from: 'lib', name: 'File' },
            { from: 'lib', name: 'FileSystemDirectoryHandle' },
            { from: 'lib', name: 'FileSystemHandle' },
            { from: 'lib', name: 'FileSystemFileHandle' },
            { from: 'lib', name: 'RequestInfo' },
            { from: 'lib', name: 'URL' },
            { from: 'lib', name: 'CacheQueryOptions' },
            { from: 'package', name: 'MessagePortMain', package: 'electron' },
            { from: 'package', name: 'Socket', package: 'node:net' },
            { from: 'package', name: 'Dirent', package: 'node:fs' },
          ],
        },
      ],

      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prefer-destructuring': ['error', { object: true, array: false }],
      '@typescript-eslint/no-deprecated': 'error',

      // off
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'no-case-declarations': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unused-vars': 'off', // handled by typescript
    },
  },
  {
    files: ['**/*.test.ts'],
    // @ts-ignore
    extends: [pluginJest.configs['flat/recommended']],
    settings: {
      jest: {
        version: 30,
      },
    },
    rules: {
      'unicorn/consistent-function-scoping': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      'jest/no-restricted-jest-methods': [
        'error',
        {
          advanceTimersByTime: `Don't use timers`,
          unstable_mockModule: "Don't use module mocks",
        },
      ],
      'no-restricted-syntax': [
        'error',

        {
          selector: "CallExpression[callee.type='MemberExpression'][callee.object.name='Promise'][callee.property.name='resolve']",
          message: 'Dont use Promise resolve.',
        },
      ],
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: ['**/*.yml'],
    extends: [eslintPluginYml.configs['flat/recommended']],
  },
  {
    files: ['**/package.json'],
    extends: [packageJson.configs.recommended],
  },
  {
    files: ['**/package.json'],
    rules: {
      'package-json/require-description': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    ...eslintPluginUnicorn.configs.recommended,
  },
  {
    files: ['**/*.ts'],
    rules: {
      'unicorn/filename-case': 'off',
      'unicorn/prefer-event-target': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/import-style': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/prefer-add-event-listener': 'off',
      'unicorn/prefer-set-has': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/new-for-builtins': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-math-trunc': 'off',
      'unicorn/no-array-push-push': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-for-loop': 'off',
      'unicorn/number-literal-case': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prefer-single-call': 'off',
    },
  },
  {
    ignores: [
      'dist',
      '.tmp',
      '**/build/**',
      '**/coverage/**',
      '**/server/**',
      '**/dist2/**',
      '**/dist/**',
      '**/memory/**',
      '**/fixtures/**',
      '**/test-integration/**',
      '**/test-integration-util/**',
      'scripts',
      'rollup.config.js',
      'eslint.config.js',
    ],
  },
  {
    files: ['**/*Main.ts'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  ...markdown.configs.recommended,
)

/**
 * @type {any}
 */
export const recommendedNode = [
  {
    files: ['**/*.ts'],
    ...nodePlugin.configs['flat/recommended'],
  },
  {
    files: ['**/*.ts'],
    rules: {
      'n/prefer-node-protocol': 'error',
      'n/no-unpublished-import': 'off', // TODO enable this for some node packages, which don't bundle dependencies
    },
  },
]

export const recommendedTsconfig = [...tsconfigPlugin.default]

export const recommendedActions = [...actionsPlugin.default]

export default defaultConfig
