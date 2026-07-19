import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import {
  getStaticPropertyName,
  isBinaryExpressionNode,
  isIdentifierNode,
  isMemberExpressionNode,
  isPropertyNode,
  isStringLiteral,
  isTemplateLiteralNode,
  type PropertyNode,
  type TemplateLiteralNode,
} from './ast.ts'

const isClassNameKey = (node: PropertyNode): boolean => {
  return getStaticPropertyName(node) === 'className'
}

const isClassNameProperty = (node: unknown): boolean => {
  return isPropertyNode(node) && isClassNameKey(node)
}

const isStringLiteralWithSpace = (node: unknown): boolean => {
  return isStringLiteral(node) && /\s/.test(node.value)
}

const isStaticMultiClassName = (node: unknown): boolean => {
  return isStringLiteral(node) && /\s/.test(node.value) && node.value.trim().split(/\s+/).length > 1
}

const hasTemplateClassSeparator = (node: TemplateLiteralNode): boolean => {
  return node.quasis.some((quasi) => /\s/.test(quasi.value.raw))
}

const isManualClassNameConcatenation = (node: unknown): boolean => {
  if (isStaticMultiClassName(node)) {
    return true
  }
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

const hasClassNamesReference = (node: unknown): boolean => {
  if (isMemberExpressionNode(node)) {
    return (
      (isIdentifierNode(node.object) && node.object.name === 'ClassNames') ||
      hasClassNamesReference(node.object) ||
      (node.computed && hasClassNamesReference(node.property))
    )
  }
  if (isBinaryExpressionNode(node)) {
    return hasClassNamesReference(node.left) || hasClassNamesReference(node.right)
  }
  if (isTemplateLiteralNode(node)) {
    return node.expressions.some(hasClassNamesReference)
  }
  return false
}

const getParent = (node: unknown): unknown => {
  if (typeof node === 'object' && node !== null && 'parent' in node) {
    return node.parent
  }
  return undefined
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
  const reportNamespacedClassNameComposition = (node: unknown): void => {
    if (!isManualClassNameConcatenation(node) || !hasClassNamesReference(node)) {
      return
    }
    const parent = getParent(node)
    if (isManualClassNameConcatenation(parent) || isClassNameProperty(parent)) {
      return
    }
    context.report({
      messageId: 'preferMergeClassNames',
      node: node as ESTree.Node,
    })
  }

  return {
    BinaryExpression: reportNamespacedClassNameComposition,
    Property(node: unknown): void {
      if (!isPropertyNode(node) || !isClassNameKey(node) || !isManualClassNameConcatenation(node.value)) {
        return
      }
      context.report({
        messageId: 'preferMergeClassNames',
        node: node.value as ESTree.Node,
      })
    },
    TemplateLiteral: reportNamespacedClassNameComposition,
  }
}
