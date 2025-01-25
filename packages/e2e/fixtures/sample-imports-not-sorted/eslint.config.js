import * as config from '../../../plugin/index.js'

export default [
  ...config.default,
  {
    rules: {
      'project-structure/file-composition': 'off',
      'project-structure/folder-structure': 'off',
    },
  },
]
