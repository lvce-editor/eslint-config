import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

interface PropertyNode extends ESTree.BaseNode {
  computed: boolean
  key: unknown
  type: 'Property'
  value: unknown
}

interface IdentifierNode extends ESTree.BaseNode {
  name: string
  type: 'Identifier'
}

interface LiteralNode extends ESTree.BaseNode {
  type: 'Literal'
  value: unknown
}

interface TemplateLiteralNode extends ESTree.BaseNode {
  expressions: readonly unknown[]
  quasis: readonly TemplateElementNode[]
  type: 'TemplateLiteral'
}

interface TemplateElementNode extends ESTree.BaseNode {
  type: 'TemplateElement'
  value: {
    cooked?: string | null
    raw: string
  }
}

interface BinaryExpressionNode extends ESTree.BaseNode {
  left: unknown
  operator: string
  right: unknown
  type: 'BinaryExpression'
}

const isPropertyNode = (node: unknown): node is PropertyNode => {
  return (
    typeof node === 'object' && node !== null && 'type' in node && node.type === 'Property' && 'key' in node && 'value' in node && 'computed' in node
  )
}

const isIdentifierNode = (node: unknown): node is IdentifierNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'Identifier' && 'name' in node
}

const isLiteralNode = (node: unknown): node is LiteralNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'Literal' && 'value' in node
}

const isTemplateLiteralNode = (node: unknown): node is TemplateLiteralNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'TemplateLiteral' && 'expressions' in node && 'quasis' in node
}

const isBinaryExpressionNode = (node: unknown): node is BinaryExpressionNode => {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    node.type === 'BinaryExpression' &&
    'operator' in node &&
    'left' in node &&
    'right' in node
  )
}

const isClassNameKey = (node: PropertyNode): boolean => {
  if (node.computed) {
    return false
  }
  if (isIdentifierNode(node.key)) {
    return node.key.name === 'className'
  }
  if (isLiteralNode(node.key)) {
    return node.key.value === 'className'
  }
  return false
}

const isStringLiteralWithSpace = (node: unknown): boolean => {
  return isLiteralNode(node) && typeof node.value === 'string' && /\s/.test(node.value)
}

const hasTemplateClassSeparator = (node: TemplateLiteralNode): boolean => {
  return node.quasis.some((quasi) => /\s/.test(quasi.value.raw))
}

const isManualClassNameConcatenation = (node: unknown): boolean => {
  if (isTemplateLiteralNode(node)) {
    return node.expressions.length > 0 && hasTemplateClassSeparator(node)
  }
  if (!isBinaryExpressionNode(node) || node.operator !== '+') {
    return false
  }
  return (
    isStringLiteralWithSpace(node.left) ||
    isStringLiteralWithSpace(node.right) ||
    isManualClassNameConcatenation(node.left) ||
    isManualClassNameConcatenation(node.right)
  )
}

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer mergeClassNames for composing virtual-dom className values',
  },
  messages: {
    preferMergeClassNames: 'Use `mergeClassNames(...)` instead of manually concatenating `className`.',
  },
  type: 'suggestion',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    Property(node: unknown): void {
      if (!isPropertyNode(node) || !isClassNameKey(node) || !isManualClassNameConcatenation(node.value)) {
        return
      }
      context.report({
        messageId: 'preferMergeClassNames',
        node: node.value as ESTree.Node,
      })
    },
  }
}
