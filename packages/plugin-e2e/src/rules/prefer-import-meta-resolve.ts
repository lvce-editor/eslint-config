import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer import.meta.resolve over new URL(..., import.meta.url).toString()',
  },
  messages: {
    preferImportMetaResolve: 'Use import.meta.resolve(...) instead of new URL(..., import.meta.url).toString().',
  },
  type: 'suggestion',
}

const isIdentifier = (node: ESTree.Node, name: string): node is ESTree.Identifier => {
  return node.type === 'Identifier' && node.name === name
}

const isImportMeta = (node: ESTree.Node): node is ESTree.MetaProperty => {
  return node.type === 'MetaProperty' && isIdentifier(node.meta, 'import') && isIdentifier(node.property, 'meta')
}

const isImportMetaUrl = (node: ESTree.Node): boolean => {
  return node.type === 'MemberExpression' && !node.computed && isImportMeta(node.object) && isIdentifier(node.property, 'url')
}

const isUrlConstructor = (node: ESTree.Node): node is ESTree.NewExpression => {
  return (
    node.type === 'NewExpression' &&
    node.callee.type === 'Identifier' &&
    ['URL', 'Url'].includes(node.callee.name) &&
    node.arguments.length >= 2 &&
    isImportMetaUrl(node.arguments[1])
  )
}

const isNewUrlToStringCall = (node: ESTree.SimpleCallExpression): boolean => {
  return (
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    isIdentifier(node.callee.property, 'toString') &&
    isUrlConstructor(node.callee.object)
  )
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: ESTree.SimpleCallExpression): void {
      if (!isNewUrlToStringCall(node)) {
        return
      }
      context.report({
        messageId: 'preferImportMetaResolve',
        node,
      })
    },
  }
}
