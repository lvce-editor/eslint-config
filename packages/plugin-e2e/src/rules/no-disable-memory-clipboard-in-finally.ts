import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow disabling the memory clipboard in finally blocks',
  },
  messages: {
    noDisableMemoryClipBoardInFinally:
      'Do not call ClipBoard.disableMemoryClipBoard() in a finally block. The memory clipboard is disabled automatically after each test.',
  },
  type: 'problem',
}

const isDisableMemoryClipBoardCall = (node: ESTree.SimpleCallExpression): boolean => {
  const { callee } = node
  return (
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'ClipBoard' &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'disableMemoryClipBoard'
  )
}

const isInFinallyBlock = (context: Rule.RuleContext, node: ESTree.SimpleCallExpression): boolean => {
  const ancestors = context.sourceCode.getAncestors(node)
  return ancestors.some((ancestor) => {
    if (ancestor.type !== 'TryStatement') {
      return false
    }
    const { finalizer } = ancestor
    return finalizer !== null && finalizer !== undefined && ancestors.includes(finalizer)
  })
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: ESTree.SimpleCallExpression): void {
      if (!isDisableMemoryClipBoardCall(node) || !isInFinallyBlock(context, node)) {
        return
      }
      context.report({
        messageId: 'noDisableMemoryClipBoardInFinally',
        node,
      })
    },
  }
}
