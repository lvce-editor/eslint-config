import config from '../../index.js'

export default [
  ...config,
  {
    rules: {
      'project-structure/file-composition': 'off',
      'project-structure/folder-structure': 'off',
    },
  },
]
