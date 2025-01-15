import * as config from '../../index.js'

export default [
  ...config.default,
  ...config.recommendedFolderStructure,
  {
    rules: {
      'project-structure/folder-structure': 'off',
    },
  },
]
