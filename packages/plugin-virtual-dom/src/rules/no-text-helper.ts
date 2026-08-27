import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow local text helper functions for creating virtual DOM text nodes',
  },
  messages: {
    noTextHelper: 'Import `text` from `@lvce-editor/virtual-dom` instead of declaring a local helper.',
  },
  type: 'problem',
}

const isTextIdentifier = (node: ESTree.Pattern | null | undefined): node is ESTree.Identifier => {
  return node?.type === 'Identifier' && node.name === 'text'
}

const isFunctionExpression = (node: ESTree.Expression | null | undefined): boolean => {
  return node?.type === 'ArrowFunctionExpression' || node?.type === 'FunctionExpression'
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    FunctionDeclaration(node: ESTree.FunctionDeclaration): void {
      if (!isTextIdentifier(node.id)) {
        return
      }
      context.report({
        messageId: 'noTextHelper',
        node: node.id,
      })
    },
    VariableDeclarator(node: ESTree.VariableDeclarator): void {
      if (!isTextIdentifier(node.id) || !isFunctionExpression(node.init)) {
        return
      }
      context.report({
        messageId: 'noTextHelper',
        node: node.id,
      })
    },
  }
}
