import type { Rule } from 'eslint'

export const meta: Rule.RuleMetaData = {
  type: 'problem',
  docs: {
    description: 'Disallow inline locator expressions inside expect calls',
  },
  messages: {
    noInlineLocatorInExpect: 'Assign the locator to a variable before passing it to expect(...).',
  },
}

export const create = (): Rule.RuleListener => {
  return {}
}