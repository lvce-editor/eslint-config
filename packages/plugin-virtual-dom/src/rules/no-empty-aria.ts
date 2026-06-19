import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getStaticPropertyName, isPropertyNode, isStringLiteral, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow empty ARIA values in virtual-dom nodes',
  },
  messages: {
    noEmptyAria: 'Omit empty ARIA attributes instead of using an empty string.',
  },
  type: 'problem',
}

const isAriaProperty = (name: string): boolean => {
  return /^aria[A-Z]/.test(name)
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
        if (!name || !isAriaProperty(name) || !isStringLiteral(property.value) || property.value.value !== '') {
          continue
        }
        context.report({
          messageId: 'noEmptyAria',
          node: property.value,
        })
      }
    },
  }
}
