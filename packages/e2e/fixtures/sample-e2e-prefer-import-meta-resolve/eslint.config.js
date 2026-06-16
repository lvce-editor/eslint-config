import * as config from '../../../plugin/index.js'

export default [
  ...config.default,
  {
    rules: {
      'unicorn/no-unreadable-new-expression': 'off',
    },
  },
]
