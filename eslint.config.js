import config from './packages/plugin/index.js'
import { defineConfig } from 'eslint/config'
import eslintPlugin from 'eslint-plugin-eslint-plugin'

export default defineConfig([
  ...config,
  {
    files: ['packages/plugin-*/src/rules/**/*.ts'],
    ...eslintPlugin.configs['rules-recommended'],
  },
  {
    files: ['packages/plugin-*/test/**/*.test.ts'],
    ...eslintPlugin.configs['tests-recommended'],
  },
  {
    files: ['packages/e2e/test/**/*.ts'],
    rules: {
      'e2e/no-imports': 'off',
    },
  },
])
