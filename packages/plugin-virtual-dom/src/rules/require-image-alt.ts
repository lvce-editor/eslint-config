import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, getVirtualDomElementName, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require alt text on virtual-dom image nodes',
  },
  messages: {
    requireImageAlt: 'Add an `alt` attribute to this virtual-dom image.',
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
      if (!typeProperty || getVirtualDomElementName(typeProperty.value) !== 'Img' || getProperty(node, 'alt')) {
        return
      }
      context.report({
        messageId: 'requireImageAlt',
        node,
      })
    },
  }
}
