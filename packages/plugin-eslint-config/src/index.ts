import type { Linter } from 'eslint'
import * as defineConfig from './rules/define-config.ts'
import * as preferRecommendedActions from './rules/prefer-recommended-actions.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'eslint-config',
    version: '0.0.1',
  },
  rules: {
    'define-config': defineConfig,
    'prefer-recommended-actions': preferRecommendedActions,
  },
}

const recommended: Linter.Config[] = [
  {
    files: ['**/eslint.config.js'],
    plugins: {
      'eslint-config': plugin,
    },
    rules: {
      'eslint-config/define-config': 'error',
      'eslint-config/prefer-recommended-actions': 'error',
    },
  },
]

export default recommended
