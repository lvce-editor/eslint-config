import type { Linter } from 'eslint'
import css from '@eslint/css'
import * as defineConfig from './rules/define-config.ts'
import * as noStrictContainmentQuickPickItem from './rules/no-strict-containment-quickpick-item.ts'
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
    'no-strict-containment-quickpick-item': noStrictContainmentQuickPickItem,
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

export const recommendedQuickPickCss: Linter.Config[] = [
  {
    files: ['**/*.css'],
    language: 'css/css',
    plugins: {
      css,
      'eslint-config': plugin,
    },
    rules: {
      'eslint-config/no-strict-containment-quickpick-item': 'error',
    },
  },
]
