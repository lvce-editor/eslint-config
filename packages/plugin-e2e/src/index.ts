import type { Linter } from 'eslint'
import * as noDirectClick from './rules/no-direct-click.ts'
import * as noImports from './rules/no-imports.ts'
import * as noInlineLocatorInExpect from './rules/no-inline-locator-in-expect.ts'
import * as noInlineNthInExpect from './rules/no-inline-nth-in-expect.ts'
import * as noLazyNthVariableName from './rules/no-lazy-nth-variable-name.ts'
import * as noSkipZero from './rules/no-skip-zero.ts'
import * as preferDirectApiDestructuring from './rules/prefer-direct-api-destructuring.ts'
import * as preferExecuteExtensionCommand from './rules/prefer-execute-extension-command.ts'
import * as preferFileSystemSetFiles from './rules/prefer-filesystem-set-files.ts'
import * as preferImportMetaResolve from './rules/prefer-import-meta-resolve.ts'
import * as preferToBeHidden from './rules/prefer-to-be-hidden.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'e2e',
    version: '0.0.1',
  },
  rules: {
    'no-direct-click': noDirectClick,
    'no-imports': noImports,
    'no-inline-locator-in-expect': noInlineLocatorInExpect,
    'no-inline-nth-in-expect': noInlineNthInExpect,
    'no-lazy-nth-variable-name': noLazyNthVariableName,
    'no-skip-zero': noSkipZero,
    'prefer-direct-api-destructuring': preferDirectApiDestructuring,
    'prefer-execute-extension-command': preferExecuteExtensionCommand,
    'prefer-filesystem-set-files': preferFileSystemSetFiles,
    'prefer-import-meta-resolve': preferImportMetaResolve,
    'prefer-to-be-hidden': preferToBeHidden,
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
      'e2e/no-imports': 'error',
      'e2e/no-inline-locator-in-expect': 'error',
      'e2e/no-inline-nth-in-expect': 'error',
      'e2e/no-lazy-nth-variable-name': 'error',
      'e2e/no-skip-zero': 'error',
      'e2e/prefer-direct-api-destructuring': 'error',
      'e2e/prefer-execute-extension-command': 'error',
      'e2e/prefer-filesystem-set-files': 'error',
      'e2e/prefer-import-meta-resolve': 'error',
      'e2e/prefer-to-be-hidden': 'error',
    },
  },
]

export default recommended
