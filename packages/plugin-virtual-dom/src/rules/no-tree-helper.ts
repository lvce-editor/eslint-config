import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { hasProperty, isIdentifierNode, isObjectExpressionNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow tree helpers for creating virtual DOM nodes',
  },
  messages: {
    noTreeHelper: 'Create virtual DOM nodes as plain objects and arrays instead of using `tree(...)`.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: ESTree.CallExpression): void {
      if (!isIdentifierNode(node.callee) || node.callee.name !== 'tree') {
        return
      }
      const attributes = node.arguments[1]
      if (!isObjectExpressionNode(attributes) || !hasProperty(attributes, 'className')) {
        return
      }
      context.report({
        messageId: 'noTreeHelper',
        node,
      })
    },
  }
}
