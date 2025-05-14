import eslintPluginYml from 'eslint-plugin-yml'

export const plugin = {
  meta: {
    name: 'github-actions',
    version: '0.0.1',
  },
  rules: {
    ...eslintPluginYml.rules,
  },
  configs: {
    recommended: eslintPluginYml.configs['flat/recommended'],
  },
}

const recommended = [
  {
    plugins: {
      'github-actions': plugin,
    },
  },
]

export default recommended
