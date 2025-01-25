import config from '../../index.js'

export default [
  ...config,
  {
    rules: {
      'project-structure/folder-structure': 'off',
      'project-structure/file-composition': 'off',
    },
  },
]
