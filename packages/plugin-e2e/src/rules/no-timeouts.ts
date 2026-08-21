import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow timeouts in E2E tests',
  },
  messages: {
    noTimeouts: 'Do not use setTimeout in e2e tests. Wait for an observable condition instead.',
  },
  type: 'problem',
}

const isSetTimeoutCall = (node: ESTree.SimpleCallExpression): boolean => {
  if (node.callee.type === 'Identifier') {
    return node.callee.name === 'setTimeout'
  }
  return (
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'setTimeout'
  )
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: ESTree.SimpleCallExpression): void {
      if (!isSetTimeoutCall(node)) {
        return
      }
      context.report({
        messageId: 'noTimeouts',
        node: node.callee,
      })
    },
  }
}
