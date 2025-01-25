import * as config from '../../packages/plugin/index.js'

export default [
  ...config.default,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]
