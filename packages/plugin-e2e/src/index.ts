import type { Linter } from 'eslint'
import * as noDirectClick from './rules/no-direct-click.ts'
import * as noInlineLocatorInExpect from './rules/no-inline-locator-in-expect.ts'
import * as noInlineNthInExpect from './rules/no-inline-nth-in-expect.ts'
import * as noLazyNthVariableName from './rules/no-lazy-nth-variable-name.ts'
import * as preferDirectApiDestructuring from './rules/prefer-direct-api-destructuring.ts'
import * as preferExecuteExtensionCommand from './rules/prefer-execute-extension-command.ts'
import * as preferFileSystemSetFiles from './rules/prefer-filesystem-set-files.ts'
import * as preferImportMetaResolve from './rules/prefer-import-meta-resolve.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'e2e',
    version: '0.0.1',
  },
  rules: {
    'no-direct-click': noDirectClick,
    'no-inline-locator-in-expect': noInlineLocatorInExpect,
    'no-inline-nth-in-expect': noInlineNthInExpect,
    'no-lazy-nth-variable-name': noLazyNthVariableName,
    'prefer-direct-api-destructuring': preferDirectApiDestructuring,
    'prefer-execute-extension-command': preferExecuteExtensionCommand,
    'prefer-filesystem-set-files': preferFileSystemSetFiles,
    'prefer-import-meta-resolve': preferImportMetaResolve,
  },
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
      'e2e/prefer-direct-api-destructuring': 'error',
      'e2e/prefer-execute-extension-command': 'error',
      'e2e/prefer-filesystem-set-files': 'error',
      'e2e/prefer-import-meta-resolve': 'error',
    },
  },
]

export default recommended
