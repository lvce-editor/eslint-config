import * as config from '../../../plugin/index.js'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...config.default,
  {
    rules: {
      'unicorn/no-unreadable-new-expression': 'off',
    },
  },
])
