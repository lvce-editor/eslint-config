import config from './packages/plugin/index.js'
import eslintPlugin from 'eslint-plugin-eslint-plugin'

export default [
  ...config,
  {
    files: ['packages/plugin-*/src/rules/**/*.ts'],
    ...eslintPlugin.configs['rules-recommended'],
  },
  {
    files: ['packages/plugin-*/test/**/*.test.ts'],
    ...eslintPlugin.configs['tests-recommended'],
  },
]
