import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  type: 'problem',
  docs: {
    description: 'Disallow inline locator expressions inside expect calls',
  },
  messages: {
    noInlineLocatorInExpect: 'Assign the locator to a variable before passing it to expect(...).',
  },
}

interface TsNonNullExpression extends ESTree.BaseNode {
  type: 'TSNonNullExpression'
  expression: unknown
}

interface CallExpressionNode extends ESTree.BaseNode {
  type: 'CallExpression'
  callee: unknown
  arguments: readonly unknown[]
  optional: boolean
}

interface MemberExpressionNode extends ESTree.BaseNode {
  type: 'MemberExpression'
  object: unknown
  property: unknown
  computed: boolean
  optional: boolean
}

interface ChainExpressionNode extends ESTree.BaseNode {
  type: 'ChainExpression'
  expression: unknown
}

interface AwaitExpressionNode extends ESTree.BaseNode {
  type: 'AwaitExpression'
  argument: unknown
}

interface IdentifierNode extends ESTree.BaseNode {
  type: 'Identifier'
  name: string
}

type TraversableNode = unknown

const isCallExpressionNode = (node: TraversableNode): node is CallExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'CallExpression' && 'callee' in node && 'arguments' in node
}

const isIdentifierNode = (node: TraversableNode): node is IdentifierNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'Identifier' && 'name' in node
}

const isMemberExpressionNode = (node: TraversableNode): node is MemberExpressionNode => {
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

const isChainExpressionNode = (node: TraversableNode): node is ChainExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'ChainExpression' && 'expression' in node
}

const isAwaitExpressionNode = (node: TraversableNode): node is AwaitExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'AwaitExpression' && 'argument' in node
}

const isTsNonNullExpression = (node: TraversableNode): node is TsNonNullExpression => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'TSNonNullExpression' && 'expression' in node
}

const isLocatorCall = (node: TraversableNode): node is CallExpressionNode => {
  return isCallExpressionNode(node) && isIdentifierNode(node.callee) && node.callee.name === 'Locator'
}

const containsInlineLocatorCall = (node: TraversableNode): boolean => {
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
    CallExpression(node: ESTree.SimpleCallExpression) {
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
