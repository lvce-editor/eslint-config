import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { isArrayExpressionNode, isStringLiteral, isTextCall, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow raw string children in virtual-dom arrays',
  },
  messages: {
    noRawTextChildren: 'Use `text(...)` instead of a raw string in virtual-dom arrays.',
  },
  type: 'problem',
}

const isVirtualDomArray = (node: unknown): boolean => {
  return isArrayExpressionNode(node) && node.elements.some((element) => isVirtualDomNode(element) || isTextCall(element))
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ArrayExpression(node: ESTree.ArrayExpression): void {
      if (!isVirtualDomArray(node)) {
        return
      }
      for (const element of node.elements) {
        if (!isStringLiteral(element)) {
          continue
        }
        context.report({
          messageId: 'noRawTextChildren',
          node: element,
        })
      }
    },
  }
}
