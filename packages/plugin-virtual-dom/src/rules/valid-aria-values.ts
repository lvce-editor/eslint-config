import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getStaticPropertyName, isPropertyNode, isStringLiteral, isVirtualDomNode } from './ast.ts'

const allowedValues = new Map<string, ReadonlySet<string>>([
  ['ariaAtomic', new Set(['false', 'true'])],
  ['ariaAutoComplete', new Set(['both', 'inline', 'list', 'none'])],
  ['ariaBusy', new Set(['false', 'true'])],
  ['ariaChecked', new Set(['false', 'mixed', 'true'])],
  ['ariaCurrent', new Set(['date', 'false', 'location', 'page', 'step', 'time', 'true'])],
  ['ariaDisabled', new Set(['false', 'true'])],
  ['ariaExpanded', new Set(['false', 'true'])],
  ['ariaHasPopup', new Set(['dialog', 'false', 'grid', 'listbox', 'menu', 'tree', 'true'])],
  ['ariaHidden', new Set(['false', 'true'])],
  ['ariaInvalid', new Set(['false', 'grammar', 'spelling', 'true'])],
  ['ariaLive', new Set(['assertive', 'off', 'polite'])],
  ['ariaModal', new Set(['false', 'true'])],
  ['ariaMultiLine', new Set(['false', 'true'])],
  ['ariaMultiSelectable', new Set(['false', 'true'])],
  ['ariaOrientation', new Set(['horizontal', 'undefined', 'vertical'])],
  ['ariaPressed', new Set(['false', 'mixed', 'true'])],
  ['ariaReadOnly', new Set(['false', 'true'])],
  [
    'ariaRelevant',
    new Set([
      'additions',
      'additions removals',
      'additions text',
      'all',
      'removals',
      'removals additions',
      'removals text',
      'text',
      'text additions',
      'text removals',
    ]),
  ],
  ['ariaRequired', new Set(['false', 'true'])],
  ['ariaSelected', new Set(['false', 'true'])],
  ['ariaSort', new Set(['ascending', 'descending', 'none', 'other'])],
])

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Validate literal virtual-dom ARIA values',
  },
  messages: {
    validAriaValue: '`{{value}}` is not a valid value for `{{name}}`.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isVirtualDomNode(node)) {
        return
      }
      for (const property of node.properties) {
        if (!isPropertyNode(property)) {
          continue
        }
        const name = getStaticPropertyName(property)
        const values = name && allowedValues.get(name)
        if (!name || !values || !isStringLiteral(property.value) || values.has(property.value.value)) {
          continue
        }
        context.report({
          data: {
            name,
            value: property.value.value,
          },
          messageId: 'validAriaValue',
          node: property.value,
        })
      }
    },
  }
}
