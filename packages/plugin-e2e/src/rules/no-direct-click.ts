import type { Rule } from 'eslint'

export const meta: Rule.RuleMetaData = {
  type: 'problem',
  docs: {
    description: 'Disallow direct click calls in E2E tests',
  },
  messages: {
    noDirectClick: 'Do not call .click() directly in e2e tests. Use Command.execute(...) or the page object API instead.',
  },
}

const isDirectClickCall = (node: any): boolean => {
  return node.callee?.type === 'MemberExpression' && node.callee.property?.type === 'Identifier' && node.callee.property.name === 'click'
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: any) {
      if (!isDirectClickCall(node)) {
        return
      }
      context.report({
        node: node.callee.property,
        messageId: 'noDirectClick',
      })
    },
  }
}
