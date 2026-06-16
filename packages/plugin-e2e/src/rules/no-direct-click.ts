import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow direct click calls in E2E tests',
  },
  messages: {
    noDirectClick: 'Do not call .click() directly in e2e tests. Use Command.execute(...) or the page object API instead.',
  },
  type: 'problem',
}

const isDirectClickCall = (node: ESTree.SimpleCallExpression): node is ESTree.SimpleCallExpression & { callee: ESTree.MemberExpression } => {
  return node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier' && node.callee.property.name === 'click'
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: ESTree.SimpleCallExpression) {
      if (!isDirectClickCall(node)) {
        return
      }
      context.report({
        messageId: 'noDirectClick',
        node: node.callee.property,
      })
    },
  }
}
