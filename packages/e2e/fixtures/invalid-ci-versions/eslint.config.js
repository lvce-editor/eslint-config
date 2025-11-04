import * as config from '../../../plugin-github-actions/src/index.ts'
import eslintPluginYml from 'eslint-plugin-yml'

export default [
  ...eslintPluginYml.configs['flat/recommended'],
  ...config.default,
  {
    files: ['src/*.yml'],
    rules: {
      'github-actions/ci-versions': 'error',
    },
  },
]
