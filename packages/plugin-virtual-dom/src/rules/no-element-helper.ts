import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getVirtualDomElementName, isIdentifierNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow element helpers for creating virtual DOM nodes',
  },
  messages: {
    noElementHelper: 'Create virtual DOM nodes directly as plain objects and arrays instead of using `element(...)` and flattening a nested tree.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: ESTree.CallExpression): void {
      if (!isIdentifierNode(node.callee) || node.callee.name !== 'element' || !getVirtualDomElementName(node.arguments[0])) {
        return
      }
      context.report({
        messageId: 'noElementHelper',
        node,
      })
    },
  }
}
