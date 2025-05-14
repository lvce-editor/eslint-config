// @ts-ignore
import * as config from '../../../../.tmp/plugin-github-actions/dist/index.js'
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
