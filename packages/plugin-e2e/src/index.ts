import type { Linter } from 'eslint'
import * as noDirectClick from './rules/no-direct-click.ts'
import * as noInlineLocatorInExpect from './rules/no-inline-locator-in-expect.ts'
import * as noInlineNthInExpect from './rules/no-inline-nth-in-expect.ts'
import * as noLazyNthVariableName from './rules/no-lazy-nth-variable-name.ts'

const plugin = {
  meta: {
    name: 'e2e',
    version: '0.0.1',
  },
  rules: {
    'no-direct-click': noDirectClick,
    'no-inline-locator-in-expect': noInlineLocatorInExpect,
    'no-inline-nth-in-expect': noInlineNthInExpect,
    'no-lazy-nth-variable-name': noLazyNthVariableName,
  },
  configs: {},
}

const recommended: Linter.Config[] = [
  {
    files: ['**/e2e/**/*.ts'],
    plugins: {
      e2e: plugin,
    },
    rules: {
      'e2e/no-direct-click': 'error',
      'e2e/no-inline-locator-in-expect': 'error',
      'e2e/no-inline-nth-in-expect': 'error',
      'e2e/no-lazy-nth-variable-name': 'error',
    },
  },
]

export default recommended
