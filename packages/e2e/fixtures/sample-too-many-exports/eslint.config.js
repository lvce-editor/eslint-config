import * as config from '../../../plugin/index.js'

export default [
  ...config.default,
  ...config.recommendedFolderStructure,
  {
    rules: {
      'project-structure/folder-structure': 'off',
    },
  },
]
