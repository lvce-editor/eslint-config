import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, getStaticNumberValue, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow positive virtual-dom tabIndex values',
  },
  messages: {
    noPositiveTabIndex: 'Use a `tabIndex` of 0 or -1 instead of a positive value.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isVirtualDomNode(node)) {
        return
      }
      const tabIndexProperty = getProperty(node, 'tabIndex')
      const tabIndex = tabIndexProperty && getStaticNumberValue(tabIndexProperty.value)
      if (!tabIndexProperty || tabIndex === undefined || tabIndex <= 0) {
        return
      }
      context.report({
        messageId: 'noPositiveTabIndex',
        node: tabIndexProperty.value as ESTree.Node,
      })
    },
  }
}
