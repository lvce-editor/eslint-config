import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, getStaticNumberValue, getVirtualDomElementName, isObjectExpressionNode } from './ast.ts'

const voidElements = new Set(['Br', 'Col', 'Hr', 'Img', 'Input'])

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require canonical virtual-dom node shapes',
  },
  messages: {
    elementTextProperty: 'Use a `text(...)` child instead of a `text` property on an element node.',
    missingChildCount: 'Add an explicit `childCount` to this virtual-dom node.',
    voidElementChildren: '`VirtualDomElements.{{name}}` must have a `childCount` of 0.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isObjectExpressionNode(node)) {
        return
      }
      const typeProperty = getProperty(node, 'type')
      const elementName = typeProperty && getVirtualDomElementName(typeProperty.value)
      if (!typeProperty || !elementName) {
        return
      }
      const childCountProperty = getProperty(node, 'childCount')
      if (!childCountProperty) {
        context.report({
          messageId: 'missingChildCount',
          node,
        })
      } else if (voidElements.has(elementName) && getStaticNumberValue(childCountProperty.value) !== 0) {
        context.report({
          data: {
            name: elementName,
          },
          messageId: 'voidElementChildren',
          node: childCountProperty,
        })
      }
      const textProperty = getProperty(node, 'text')
      if (textProperty && elementName !== 'Text') {
        context.report({
          messageId: 'elementTextProperty',
          node: textProperty,
        })
      }
    },
  }
}
