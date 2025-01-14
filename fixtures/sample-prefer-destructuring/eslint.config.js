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
      'n/prefer-node-protocol': [
        'error',
        {
          version: '>=16.0.0',
        },
      ],
    },
  },
]
