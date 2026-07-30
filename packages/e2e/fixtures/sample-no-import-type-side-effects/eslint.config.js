import * as config from '../../../plugin/index.js'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...config.default,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
