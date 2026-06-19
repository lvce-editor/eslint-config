import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import {
  getStaticPropertyName,
  isArrowFunctionExpressionNode,
  isFunctionExpressionNode,
  isPropertyNode,
  isStringLiteral,
  isTemplateLiteralNode,
  isVirtualDomNode,
} from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow inline event handlers in virtual-dom nodes',
  },
  messages: {
    noInlineEventHandlers: 'Use a registered event listener id instead of an inline event handler.',
  },
  type: 'problem',
}

const isEventPropertyName = (name: string): boolean => {
  return /^on[A-Z]/.test(name)
}

const isInlineEventHandler = (node: unknown): boolean => {
  return isStringLiteral(node) || isTemplateLiteralNode(node) || isArrowFunctionExpressionNode(node) || isFunctionExpressionNode(node)
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
        if (!name || !isEventPropertyName(name) || !isInlineEventHandler(property.value)) {
          continue
        }
        context.report({
          messageId: 'noInlineEventHandlers',
          node: property.value,
        })
      }
    },
  }
}
