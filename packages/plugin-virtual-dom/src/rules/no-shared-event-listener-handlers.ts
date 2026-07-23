import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, isArrayExpressionNode, isObjectExpressionNode, isStringLiteral } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require each virtual-dom event listener to call its dedicated handler',
  },
  messages: {
    noSharedEventListenerHandler: 'Use the dedicated handler `{{name}}` as the first event listener parameter instead of `{{handler}}`.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isObjectExpressionNode(node)) {
        return
      }
      const nameProperty = getProperty(node, 'name')
      const paramsProperty = getProperty(node, 'params')
      if (!nameProperty || !paramsProperty || !isStringLiteral(nameProperty.value) || !isArrayExpressionNode(paramsProperty.value)) {
        return
      }
      const name = nameProperty.value.value
      const firstParameter = paramsProperty.value.elements[0]
      if (!name.startsWith('handle') || !isStringLiteral(firstParameter) || firstParameter.value === name) {
        return
      }
      context.report({
        data: {
          handler: firstParameter.value,
          name,
        },
        messageId: 'noSharedEventListenerHandler',
        node: firstParameter,
      })
    },
  }
}
