import * as config from '../../packages/plugin/index.js'

export default [
  ...config.default,
  ...config.recommendedFolderStructure,
  {
    rules: {
      'project-structure/folder-structure': 'off',
    },
  },
]
