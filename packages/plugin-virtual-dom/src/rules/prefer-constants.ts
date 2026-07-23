import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getStaticPropertyName, isNumericLiteral, isPropertyNode, isStringLiteral, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer virtual-dom constants over raw type, role, aria boolean, and tabIndex values',
  },
  messages: {
    preferAriaBooleanConstant: 'Use an ARIA boolean constant instead of a raw string.',
    preferEventListenerConstant: 'Use a named event listener constant instead of a raw numeric id.',
    preferRoleConstant: 'Use `AriaRoles.*` instead of a raw role string.',
    preferTabIndexConstant: 'Use `TabIndex.*` instead of a raw tabIndex number.',
    preferTypeConstant: 'Use `VirtualDomElements.*` instead of a raw element type number.',
  },
  type: 'suggestion',
}

const isAriaBooleanProperty = (name: string): boolean => {
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
        if (!name) {
          continue
        }
        if (name === 'type' && isNumericLiteral(property.value)) {
          context.report({
            messageId: 'preferTypeConstant',
            node: property.value,
          })
          continue
        }
        if (name === 'role' && isStringLiteral(property.value)) {
          context.report({
            messageId: 'preferRoleConstant',
            node: property.value,
          })
          continue
        }
        if (name === 'tabIndex' && isNumericLiteral(property.value)) {
          context.report({
            messageId: 'preferTabIndexConstant',
            node: property.value,
          })
          continue
        }
        if (/^on[A-Z]/.test(name) && isNumericLiteral(property.value)) {
          context.report({
            messageId: 'preferEventListenerConstant',
            node: property.value,
          })
          continue
        }
        if (isAriaBooleanProperty(name) && isStringLiteral(property.value) && (property.value.value === 'true' || property.value.value === 'false')) {
          context.report({
            messageId: 'preferAriaBooleanConstant',
            node: property.value,
          })
        }
      }
    },
  }
}
