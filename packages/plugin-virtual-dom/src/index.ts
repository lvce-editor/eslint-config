import type { Linter } from 'eslint'
import * as clickableDivNeedsRole from './rules/clickable-div-needs-role.ts'
import * as noEmptyAria from './rules/no-empty-aria.ts'
import * as noEmptyClassName from './rules/no-empty-class-name.ts'
import * as noInlineEventHandlers from './rules/no-inline-event-handlers.ts'
import * as noInlineStyle from './rules/no-inline-style.ts'
import * as noObjectAttributeValues from './rules/no-object-attribute-values.ts'
import * as noRawTextChildren from './rules/no-raw-text-children.ts'
import * as preferConstants from './rules/prefer-constants.ts'
import * as preferMergeClassNames from './rules/prefer-merge-class-names.ts'
import * as preferStateDestructuring from './rules/prefer-state-destructuring.ts'
import * as validChildCount from './rules/valid-child-count.ts'

const plugin = {
  configs: {},
  meta: {
    name: 'virtual-dom',
    version: '0.0.1',
  },
  rules: {
    'clickable-div-needs-role': clickableDivNeedsRole,
    'no-empty-aria': noEmptyAria,
    'no-empty-class-name': noEmptyClassName,
    'no-inline-event-handlers': noInlineEventHandlers,
    'no-inline-style': noInlineStyle,
    'no-object-attribute-values': noObjectAttributeValues,
    'no-raw-text-children': noRawTextChildren,
    'prefer-constants': preferConstants,
    'prefer-merge-class-names': preferMergeClassNames,
    'prefer-state-destructuring': preferStateDestructuring,
    'valid-child-count': validChildCount,
  },
}

const recommended: Linter.Config[] = [
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      'virtual-dom': plugin,
    },
    rules: {
      'virtual-dom/clickable-div-needs-role': 'error',
      'virtual-dom/no-empty-aria': 'error',
      'virtual-dom/no-empty-class-name': 'error',
      'virtual-dom/no-inline-event-handlers': 'error',
      'virtual-dom/no-inline-style': 'error',
      'virtual-dom/no-object-attribute-values': 'error',
      'virtual-dom/no-raw-text-children': 'error',
      'virtual-dom/prefer-constants': 'error',
      'virtual-dom/prefer-merge-class-names': 'error',
      'virtual-dom/prefer-state-destructuring': 'error',
      'virtual-dom/valid-child-count': 'error',
    },
  },
]

export default recommended
