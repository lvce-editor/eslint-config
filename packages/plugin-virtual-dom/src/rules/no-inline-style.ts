import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow inline style attributes in virtual-dom nodes',
  },
  messages: {
    noInlineStyle: 'Use class names or generated CSS instead of inline `style`.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isVirtualDomNode(node)) {
        return
      }
      const styleProperty = getProperty(node, 'style')
      if (!styleProperty) {
        return
      }
      context.report({
        messageId: 'noInlineStyle',
        node: styleProperty,
      })
    },
  }
}
