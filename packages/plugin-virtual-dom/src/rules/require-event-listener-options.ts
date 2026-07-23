import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, isLiteralNode, isObjectExpressionNode, isStringLiteral } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require event listener options for handlers with specific browser event behavior',
  },
  messages: {
    requirePreventDefault: '`{{name}}` event listeners must set `preventDefault` to `true`.',
  },
  type: 'problem',
}

const listenersRequiringPreventDefault = new Set(['handleDragOver', 'handleDrop'])

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isObjectExpressionNode(node) || !getProperty(node, 'params')) {
        return
      }
      const nameProperty = getProperty(node, 'name')
      if (!nameProperty || !isStringLiteral(nameProperty.value) || !listenersRequiringPreventDefault.has(nameProperty.value.value)) {
        return
      }
      const preventDefaultProperty = getProperty(node, 'preventDefault')
      if (preventDefaultProperty && isLiteralNode(preventDefaultProperty.value) && preventDefaultProperty.value.value === true) {
        return
      }
      context.report({
        data: {
          name: nameProperty.value.value,
        },
        messageId: 'requirePreventDefault',
        node: preventDefaultProperty ? (preventDefaultProperty.value as ESTree.Node) : nameProperty,
      })
    },
  }
}
