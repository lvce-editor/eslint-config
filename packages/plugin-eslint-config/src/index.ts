import type { Linter } from 'eslint'
import * as defineConfig from './rules/define-config.ts'
import * as preferRecommendedActions from './rules/prefer-recommended-actions.ts'
import * as preferRecommendedRegex from './rules/prefer-recommended-regex.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'eslint-config',
    version: '0.0.1',
  },
  rules: {
    'define-config': defineConfig,
    'prefer-recommended-actions': preferRecommendedActions,
    'prefer-recommended-regex': preferRecommendedRegex,
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
      'eslint-config/prefer-recommended-regex': 'error',
    },
  },
]

export default recommended
