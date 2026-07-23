import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, isStringLiteral, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer constants for single literal virtual-dom class names',
  },
  messages: {
    preferClassNameConstant: 'Use a `ClassNames.*` constant instead of a literal `className`.',
  },
  type: 'suggestion',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isVirtualDomNode(node)) {
        return
      }
      const classNameProperty = getProperty(node, 'className')
      if (
        !classNameProperty ||
        !isStringLiteral(classNameProperty.value) ||
        classNameProperty.value.value === '' ||
        /\s/.test(classNameProperty.value.value)
      ) {
        return
      }
      context.report({
        messageId: 'preferClassNameConstant',
        node: classNameProperty.value,
      })
    },
  }
}
