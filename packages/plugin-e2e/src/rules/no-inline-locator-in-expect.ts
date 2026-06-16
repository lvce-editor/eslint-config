import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow inline locator expressions inside expect calls',
  },
  messages: {
    noInlineLocatorInExpect: 'Assign the locator to a variable before passing it to expect(...).',
  },
  type: 'problem',
}

interface TsNonNullExpression extends ESTree.BaseNode {
  expression: unknown
  type: 'TSNonNullExpression'
}

interface CallExpressionNode extends ESTree.BaseNode {
  arguments: readonly unknown[]
  callee: unknown
  optional: boolean
  type: 'CallExpression'
}

interface MemberExpressionNode extends ESTree.BaseNode {
  computed: boolean
  object: unknown
  optional: boolean
  property: unknown
  type: 'MemberExpression'
}

interface ChainExpressionNode extends ESTree.BaseNode {
  expression: unknown
  type: 'ChainExpression'
}

interface AwaitExpressionNode extends ESTree.BaseNode {
  argument: unknown
  type: 'AwaitExpression'
}

interface IdentifierNode extends ESTree.BaseNode {
  name: string
  type: 'Identifier'
}

const isCallExpressionNode = (node: unknown): node is CallExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'CallExpression' && 'callee' in node && 'arguments' in node
}

const isIdentifierNode = (node: unknown): node is IdentifierNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'Identifier' && 'name' in node
}

const isMemberExpressionNode = (node: unknown): node is MemberExpressionNode => {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    node.type === 'MemberExpression' &&
    'object' in node &&
    'property' in node &&
    'computed' in node
  )
}

const isChainExpressionNode = (node: unknown): node is ChainExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'ChainExpression' && 'expression' in node
}

const isAwaitExpressionNode = (node: unknown): node is AwaitExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'AwaitExpression' && 'argument' in node
}

const isTsNonNullExpression = (node: unknown): node is TsNonNullExpression => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'TSNonNullExpression' && 'expression' in node
}

const isLocatorCall = (node: unknown): node is CallExpressionNode => {
  return isCallExpressionNode(node) && isIdentifierNode(node.callee) && node.callee.name === 'Locator'
}

const containsInlineLocatorCall = (node: unknown): boolean => {
  if (!node) {
    return false
  }
  if (isLocatorCall(node)) {
    return true
  }
  if (isCallExpressionNode(node)) {
    return containsInlineLocatorCall(node.callee) || node.arguments.some(containsInlineLocatorCall)
  }
  if (isMemberExpressionNode(node)) {
    return containsInlineLocatorCall(node.object) || (node.computed && containsInlineLocatorCall(node.property))
  }
  if (isChainExpressionNode(node)) {
    return containsInlineLocatorCall(node.expression)
  }
  if (isAwaitExpressionNode(node)) {
    return containsInlineLocatorCall(node.argument)
  }
  if (isTsNonNullExpression(node)) {
    return containsInlineLocatorCall(node.expression)
  }
  return false
}

const isExpectCall = (node: ESTree.SimpleCallExpression): boolean => {
  return node.callee.type === 'Identifier' && node.callee.name === 'expect'
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: ESTree.SimpleCallExpression): void {
      if (!isExpectCall(node)) {
        return
      }
      const [firstArgument] = node.arguments
      if (!containsInlineLocatorCall(firstArgument)) {
        return
      }
      context.report({
        messageId: 'noInlineLocatorInExpect',
        node: firstArgument,
      })
    },
  }
}
