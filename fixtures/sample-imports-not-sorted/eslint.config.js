import config from '../../index.js'

export default [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'project-structure/file-composition': 'off',
      'project-structure/folder-structure': 'off',
    },
  },
]
