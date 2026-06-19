import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import {
  getStaticPropertyName,
  isArrayExpressionNode,
  isArrowFunctionExpressionNode,
  isFunctionExpressionNode,
  isObjectExpressionNode,
  isPropertyNode,
  isVirtualDomNode,
} from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow object-like attribute values in virtual-dom nodes',
  },
  messages: {
    noObjectAttributeValues: 'Avoid object, array, or function attribute values because virtual-dom diffing compares attributes by reference.',
  },
  type: 'problem',
}

const ignoredProperties = new Set(['childCount', 'type'])

const isObjectLikeAttributeValue = (node: unknown): boolean => {
  return isObjectExpressionNode(node) || isArrayExpressionNode(node) || isArrowFunctionExpressionNode(node) || isFunctionExpressionNode(node)
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isVirtualDomNode(node)) {
        return
      }
      for (const property of node.properties) {
        if (!isPropertyNode(property)) {
          continue
        }
        const name = getStaticPropertyName(property)
        if (!name || ignoredProperties.has(name) || !isObjectLikeAttributeValue(property.value)) {
          continue
        }
        context.report({
          messageId: 'noObjectAttributeValues',
          node: property.value,
        })
      }
    },
  }
}
