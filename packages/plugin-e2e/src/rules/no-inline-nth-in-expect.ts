import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow inline nth locator expressions inside expect calls',
  },
  messages: {
    noInlineNthInExpect: 'Assign the nth locator to a variable before passing it to expect(...).',
  },
  type: 'problem',
}

interface TsAsExpressionNode extends ESTree.BaseNode {
  expression: unknown
  type: 'TSAsExpression'
}

interface TsNonNullExpressionNode extends ESTree.BaseNode {
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

const isTsAsExpressionNode = (node: unknown): node is TsAsExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'TSAsExpression' && 'expression' in node
}

const isTsNonNullExpressionNode = (node: unknown): node is TsNonNullExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'TSNonNullExpression' && 'expression' in node
}

const isNthCall = (node: unknown): node is CallExpressionNode => {
  return (
    isCallExpressionNode(node) &&
    isMemberExpressionNode(node.callee) &&
    !node.callee.computed &&
    isIdentifierNode(node.callee.property) &&
    node.callee.property.name === 'nth'
  )
}

const containsInlineNthCall = (node: unknown): boolean => {
  if (!node) {
    return false
  }
  if (isNthCall(node)) {
    return true
  }
  if (isCallExpressionNode(node)) {
    return containsInlineNthCall(node.callee) || node.arguments.some(containsInlineNthCall)
  }
  if (isMemberExpressionNode(node)) {
    return containsInlineNthCall(node.object) || (node.computed && containsInlineNthCall(node.property))
  }
  if (isChainExpressionNode(node)) {
    return containsInlineNthCall(node.expression)
  }
  if (isAwaitExpressionNode(node)) {
    return containsInlineNthCall(node.argument)
  }
  if (isTsAsExpressionNode(node)) {
    return containsInlineNthCall(node.expression)
  }
  if (isTsNonNullExpressionNode(node)) {
    return containsInlineNthCall(node.expression)
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
      if (!containsInlineNthCall(firstArgument)) {
        return
      }
      context.report({
        messageId: 'noInlineNthInExpect',
        node: firstArgument,
      })
    },
  }
}
