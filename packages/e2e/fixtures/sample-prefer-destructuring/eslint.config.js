import * as config from '../../../plugin/index.js'

export default [
  ...config.default,
  {
    rules: {
      'project-structure/folder-structure': 'off',
      'project-structure/file-composition': 'off',
    },
  },
]
