import * as config from '../../../plugin/index.js'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  config.recommendedNvmrc.map((config) => ({
    ...config,
    rules: {
      ...config.rules,
      'nvmrc/valid-version': ['error', { badVersions: [], maximumVersion: '27.0.0', minimumVersion: '20.0.0' }],
    },
  })),
)
