import * as config from '../../../plugin/index.js'
import json from '@eslint/json'

export default [
  {
    plugins: {
      json,
    },
  },
  {
    files: ['**/*.json'],
    language: 'json/json',
    rules: {},
  },
  ...config.recommendedTsconfig,
]
