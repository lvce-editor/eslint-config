import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer URL.canParse over catching errors from the URL constructor',
  },
  messages: {
    preferUrlCanParse: 'Use URL.canParse() to validate the URL before calling new URL().',
  },
  type: 'suggestion',
}

const isUrlConstructor = (node: ESTree.NewExpression): boolean => {
  return node.callee.type === 'Identifier' && node.callee.name === 'URL'
}

const isInCaughtTryBlock = (context: Rule.RuleContext, node: ESTree.NewExpression): boolean => {
  const ancestors = context.sourceCode.getAncestors(node)
  return ancestors.some((ancestor) => {
    return ancestor.type === 'TryStatement' && ancestor.handler !== null && ancestors.includes(ancestor.block)
  })
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    NewExpression(node: ESTree.NewExpression): void {
      if (!isUrlConstructor(node) || !isInCaughtTryBlock(context, node)) {
        return
      }
      context.report({
        messageId: 'preferUrlCanParse',
        node,
      })
    },
  }
}
