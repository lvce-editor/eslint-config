import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, getStaticNumberValue, isArrayExpressionNode, isTextCall, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Validate statically analyzable virtual-dom childCount values',
  },
  messages: {
    invalidChildCount: '`childCount` must be a non-negative integer.',
    validChildCount: '`childCount` declares more children than this static virtual-dom array contains.',
  },
  type: 'problem',
}

const getChildCountNode = (node: unknown): ESTree.Node | undefined => {
  if (!isVirtualDomNode(node)) {
    return undefined
  }
  return getProperty(node, 'childCount')?.value as ESTree.Node | undefined
}

const getStaticChildCount = (node: unknown): number | undefined => {
  if (isTextCall(node)) {
    return 0
  }
  if (!isVirtualDomNode(node)) {
    return undefined
  }
  const childCountProperty = getProperty(node, 'childCount')
  if (!childCountProperty) {
    return 0
  }
  const childCount = getStaticNumberValue(childCountProperty.value)
  if (childCount === undefined) {
    return undefined
  }
  return childCount
}

const isValidChildCount = (childCount: number): boolean => {
  return Number.isSafeInteger(childCount) && childCount >= 0
}

const isAnalyzableVirtualDomElement = (node: unknown): boolean => {
  return isTextCall(node) || isVirtualDomNode(node)
}

const computeSubtreeEnd = (elements: readonly unknown[], index: number): number | undefined => {
  const childCount = getStaticChildCount(elements[index])
  if (childCount === undefined || !isValidChildCount(childCount)) {
    return undefined
  }
  let next = index + 1
  for (let childIndex = 0; childIndex < childCount; childIndex++) {
    if (next >= elements.length) {
      return undefined
    }
    const childEnd = computeSubtreeEnd(elements, next)
    if (childEnd === undefined) {
      return undefined
    }
    next = childEnd
  }
  return next
}

const hasImpossibleChildCount = (elements: readonly unknown[], index: number): boolean => {
  const childCount = getStaticChildCount(elements[index])
  if (childCount === undefined || !isValidChildCount(childCount)) {
    return false
  }
  let next = index + 1
  for (let childIndex = 0; childIndex < childCount; childIndex++) {
    if (next >= elements.length) {
      return true
    }
    const childEnd = computeSubtreeEnd(elements, next)
    if (childEnd === undefined) {
      return true
    }
    next = childEnd
  }
  return false
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ArrayExpression(node: ESTree.ArrayExpression): void {
      if (!isArrayExpressionNode(node) || !node.elements.some(isVirtualDomNode) || !node.elements.every(isAnalyzableVirtualDomElement)) {
        return
      }
      for (let index = 0; index < node.elements.length; index++) {
        const element = node.elements[index]
        const childCount = getStaticChildCount(element)
        const childCountNode = getChildCountNode(element)
        if (childCount !== undefined && !isValidChildCount(childCount) && childCountNode) {
          context.report({
            messageId: 'invalidChildCount',
            node: childCountNode,
          })
          continue
        }
        if (childCountNode && hasImpossibleChildCount(node.elements, index)) {
          context.report({
            messageId: 'validChildCount',
            node: childCountNode,
          })
        }
      }
    },
  }
}
