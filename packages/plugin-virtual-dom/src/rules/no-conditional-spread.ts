import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { isArrayExpressionNode, isTextCall, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow conditional spreads in virtual-dom arrays',
  },
  messages: {
    noConditionalSpread: 'Move conditional virtual-dom children into a helper function and spread the helper result.',
  },
  type: 'suggestion',
}

type ConditionalSpread = ESTree.SpreadElement & {
  argument: ESTree.ConditionalExpression
}

const isConditionalSpread = (node: ESTree.Expression | ESTree.SpreadElement | null): node is ConditionalSpread => {
  return node?.type === 'SpreadElement' && node.argument.type === 'ConditionalExpression'
}

const isVirtualDomArray = (node: unknown): boolean => {
  return isArrayExpressionNode(node) && node.elements.some((element) => isVirtualDomNode(element) || isTextCall(element))
}

const addsVirtualDomChildren = (spread: ConditionalSpread): boolean => {
  return isVirtualDomArray(spread.argument.consequent) || isVirtualDomArray(spread.argument.alternate)
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ArrayExpression(node: ESTree.ArrayExpression): void {
      const conditionalSpreads = node.elements.filter(isConditionalSpread)
      if (!isVirtualDomArray(node) && !conditionalSpreads.some(addsVirtualDomChildren)) {
        return
      }
      for (const spread of conditionalSpreads) {
        context.report({
          messageId: 'noConditionalSpread',
          node: spread,
        })
      }
    },
  }
}
