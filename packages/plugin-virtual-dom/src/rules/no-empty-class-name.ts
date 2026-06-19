import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, isStringLiteral, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow empty className values in virtual-dom nodes',
  },
  messages: {
    noEmptyClassName: 'Omit `className` instead of using an empty string.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isVirtualDomNode(node)) {
        return
      }
      const classNameProperty = getProperty(node, 'className')
      if (!classNameProperty || !isStringLiteral(classNameProperty.value) || classNameProperty.value.value !== '') {
        return
      }
      context.report({
        messageId: 'noEmptyClassName',
        node: classNameProperty.value,
      })
    },
  }
}
