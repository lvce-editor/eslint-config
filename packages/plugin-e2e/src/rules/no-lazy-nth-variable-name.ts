import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow lazy nth-based variable names for locator variables',
  },
  messages: {
    noLazyNthVariableName: 'Prefer a specific variable name like firstRow or row0 over nth-based names like rowsNth0.',
  },
  type: 'problem',
}

interface VariableDeclaratorNode extends ESTree.BaseNode {
  id: unknown
  init: unknown
  type: 'VariableDeclarator'
}

interface IdentifierNode extends ESTree.BaseNode {
  name: string
  type: 'Identifier'
}

interface CallExpressionNode extends ESTree.BaseNode {
  arguments: readonly unknown[]
  callee: unknown
  type: 'CallExpression'
}

interface MemberExpressionNode extends ESTree.BaseNode {
  computed: boolean
  object: unknown
  property: unknown
  type: 'MemberExpression'
}

interface ChainExpressionNode extends ESTree.BaseNode {
  expression: unknown
  type: 'ChainExpression'
}

interface TsAsExpressionNode extends ESTree.BaseNode {
  expression: unknown
  type: 'TSAsExpression'
}

interface TsNonNullExpressionNode extends ESTree.BaseNode {
  expression: unknown
  type: 'TSNonNullExpression'
}

const lazyNthVariableNamePattern = /nth\d+/i

const isIdentifierNode = (node: unknown): node is IdentifierNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'Identifier' && 'name' in node
}

const isVariableDeclaratorNode = (node: unknown): node is VariableDeclaratorNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'VariableDeclarator' && 'id' in node && 'init' in node
}

const isCallExpressionNode = (node: unknown): node is CallExpressionNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'CallExpression' && 'callee' in node && 'arguments' in node
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

const containsNthCall = (node: unknown): boolean => {
  if (!node) {
    return false
  }
  if (isNthCall(node)) {
    return true
  }
  if (isCallExpressionNode(node)) {
    return containsNthCall(node.callee) || node.arguments.some(containsNthCall)
  }
  if (isMemberExpressionNode(node)) {
    return containsNthCall(node.object) || (node.computed && containsNthCall(node.property))
  }
  if (isChainExpressionNode(node)) {
    return containsNthCall(node.expression)
  }
  if (isTsAsExpressionNode(node)) {
    return containsNthCall(node.expression)
  }
  if (isTsNonNullExpressionNode(node)) {
    return containsNthCall(node.expression)
  }
  return false
}

const hasLazyNthVariableName = (node: unknown): node is IdentifierNode => {
  return isIdentifierNode(node) && lazyNthVariableNamePattern.test(node.name)
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    VariableDeclarator(node: ESTree.Node): void {
      if (!isVariableDeclaratorNode(node)) {
        return
      }
      if (!hasLazyNthVariableName(node.id)) {
        return
      }
      if (!containsNthCall(node.init)) {
        return
      }
      context.report({
        messageId: 'noLazyNthVariableName',
        node: node.id,
      })
    },
  }
}
