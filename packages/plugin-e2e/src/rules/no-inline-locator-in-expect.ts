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

const isLocatorCall = (node: any): boolean => {
  return node?.type === 'CallExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'Locator'
}

const containsInlineLocatorCall = (node: any): boolean => {
  if (!node || typeof node !== 'object') {
    return false
  }
  if (isLocatorCall(node)) {
    return true
  }
  switch (node.type) {
    case 'CallExpression':
      return containsInlineLocatorCall(node.callee) || node.arguments.some(containsInlineLocatorCall)
    case 'MemberExpression':
      return containsInlineLocatorCall(node.object) || (node.computed && containsInlineLocatorCall(node.property))
    case 'ChainExpression':
      return containsInlineLocatorCall(node.expression)
    case 'AwaitExpression':
      return containsInlineLocatorCall(node.argument)
    case 'TSNonNullExpression':
      return containsInlineLocatorCall(node.expression)
    default:
      return false
  }
}

const isExpectCall = (node: any): boolean => {
  return node.callee?.type === 'Identifier' && node.callee.name === 'expect'
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: any) {
      if (!isExpectCall(node)) {
        return
      }
      const [firstArgument] = node.arguments
      if (!containsInlineLocatorCall(firstArgument)) {
        return
      }
      context.report({
        node: firstArgument,
        messageId: 'noInlineLocatorInExpect',
      })
    },
  }
}
