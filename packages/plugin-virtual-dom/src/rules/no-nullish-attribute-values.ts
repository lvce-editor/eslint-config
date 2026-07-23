import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getStaticPropertyName, isIdentifierNode, isLiteralNode, isPropertyNode, isVirtualDomNode } from './ast.ts'

const ignoredProperties = new Set(['childCount', 'type'])

const isOptionalExpression = (node: unknown): boolean => {
  return (
    typeof node === 'object' &&
    node !== null &&
    (('type' in node && node.type === 'ChainExpression') || ('optional' in node && node.optional === true))
  )
}

const isNullish = (node: unknown): boolean => {
  return (isLiteralNode(node) && node.value === null) || (isIdentifierNode(node) && node.name === 'undefined') || isOptionalExpression(node)
}

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow nullish virtual-dom attribute values',
  },
  messages: {
    noNullishAttributeValue: 'Omit `{{name}}` instead of assigning a nullish value.',
  },
  type: 'problem',
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
        if (!name || ignoredProperties.has(name) || !isNullish(property.value)) {
          continue
        }
        context.report({
          data: {
            name,
          },
          messageId: 'noNullishAttributeValue',
          node: property.value,
        })
      }
    },
  }
}
