import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, getStaticNumberValue, getVirtualDomElementName, isVirtualDomNode } from './ast.ts'

const controlsRequiringDirectName = new Set(['Input', 'TextArea'])
const controlsAllowingChildren = new Set(['A', 'Button'])

const hasDirectName = (node: ESTree.ObjectExpression): boolean => {
  return Boolean(getProperty(node, 'ariaLabel') || getProperty(node, 'ariaLabelledBy') || getProperty(node, 'title'))
}

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require a statically determinable accessible name for virtual-dom controls',
  },
  messages: {
    accessibleControlName: 'Add an accessible name to this virtual-dom `{{name}}` control.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isVirtualDomNode(node) || hasDirectName(node)) {
        return
      }
      const typeProperty = getProperty(node, 'type')
      const elementName = typeProperty && getVirtualDomElementName(typeProperty.value)
      if (!elementName) {
        return
      }
      if (controlsRequiringDirectName.has(elementName)) {
        context.report({
          data: {
            name: elementName,
          },
          messageId: 'accessibleControlName',
          node,
        })
        return
      }
      if (!controlsAllowingChildren.has(elementName)) {
        return
      }
      const childCountProperty = getProperty(node, 'childCount')
      const childCount = childCountProperty && getStaticNumberValue(childCountProperty.value)
      if (childCount !== 0) {
        return
      }
      context.report({
        data: {
          name: elementName,
        },
        messageId: 'accessibleControlName',
        node,
      })
    },
  }
}
