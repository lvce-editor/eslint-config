import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, isMemberExpressionWithProperty, isStringLiteral, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require secure attributes on virtual-dom links',
  },
  messages: {
    secureLinkRel: 'Set `rel` to `noopener noreferrer` on virtual-dom links.',
    secureLinkTarget: 'Set `target` to `_blank` on virtual-dom links.',
  },
  type: 'problem',
}

const hasStringPropertyValue = (node: ESTree.ObjectExpression, name: string, value: string): boolean => {
  const property = getProperty(node, name)
  return Boolean(property && isStringLiteral(property.value) && property.value.value === value)
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isVirtualDomNode(node)) {
        return
      }
      const typeProperty = getProperty(node, 'type')
      const hrefProperty = getProperty(node, 'href')
      if (!typeProperty || !hrefProperty || !isMemberExpressionWithProperty(typeProperty.value, 'A')) {
        return
      }
      if (!hasStringPropertyValue(node, 'target', '_blank')) {
        context.report({
          messageId: 'secureLinkTarget',
          node,
        })
      }
      if (!hasStringPropertyValue(node, 'rel', 'noopener noreferrer')) {
        context.report({
          messageId: 'secureLinkRel',
          node,
        })
      }
    },
  }
}
