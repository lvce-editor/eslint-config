import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getStaticPropertyName, isPropertyNode, isVirtualDomNode } from './ast.ts'

const validAriaProperties = new Set([
  'ariaActivedescendant',
  'ariaAtomic',
  'ariaAutoComplete',
  'ariaBrailleLabel',
  'ariaBrailleRoleDescription',
  'ariaBusy',
  'ariaChecked',
  'ariaColCount',
  'ariaColIndex',
  'ariaColIndexText',
  'ariaColSpan',
  'ariaControls',
  'ariaCurrent',
  'ariaDescribedBy',
  'ariaDescription',
  'ariaDetails',
  'ariaDisabled',
  'ariaErrorMessage',
  'ariaExpanded',
  'ariaFlowTo',
  'ariaHasPopup',
  'ariaHidden',
  'ariaInvalid',
  'ariaKeyShortcuts',
  'ariaLabel',
  'ariaLabelledBy',
  'ariaLevel',
  'ariaLive',
  'ariaModal',
  'ariaMultiLine',
  'ariaMultiSelectable',
  'ariaOrientation',
  'ariaOwns',
  'ariaPlaceholder',
  'ariaPosInSet',
  'ariaPressed',
  'ariaReadOnly',
  'ariaRelevant',
  'ariaRequired',
  'ariaRoleDescription',
  'ariaRowCount',
  'ariaRowIndex',
  'ariaRowIndexText',
  'ariaRowSpan',
  'ariaSelected',
  'ariaSetSize',
  'ariaSort',
  'ariaValueMax',
  'ariaValueMin',
  'ariaValueNow',
  'ariaValueText',
])

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Validate virtual-dom ARIA property names',
  },
  messages: {
    validAriaProperty: '`{{name}}` is not a valid virtual-dom ARIA property.',
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
        if (!name?.startsWith('aria') || validAriaProperties.has(name)) {
          continue
        }
        context.report({
          data: {
            name,
          },
          messageId: 'validAriaProperty',
          node: property,
        })
      }
    },
  }
}
