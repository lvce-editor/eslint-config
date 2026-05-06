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

export const create = (): Rule.RuleListener => {
  return {}
}