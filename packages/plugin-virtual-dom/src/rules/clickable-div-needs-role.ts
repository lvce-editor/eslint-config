import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, isMemberExpressionWithProperty, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require an explicit role on clickable virtual-dom div nodes',
  },
  messages: {
    clickableDivNeedsRole: 'Add an explicit `role` to clickable virtual-dom div nodes.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isVirtualDomNode(node)) {
        return
      }
      const typeProperty = getProperty(node, 'type')
      const clickProperty = getProperty(node, 'onClick')
      const roleProperty = getProperty(node, 'role')
      if (!typeProperty || !clickProperty || roleProperty || !isMemberExpressionWithProperty(typeProperty.value, 'Div')) {
        return
      }
      context.report({
        messageId: 'clickableDivNeedsRole',
        node: clickProperty,
      })
    },
  }
}
