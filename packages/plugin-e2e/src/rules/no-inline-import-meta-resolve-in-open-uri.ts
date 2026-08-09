import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow inline import.meta.resolve calls in Main.openUri calls',
  },
  messages: {
    noInlineImportMetaResolveInOpenUri: 'Assign import.meta.resolve(...) to a variable before passing the URI to Main.openUri(...).',
  },
  type: 'problem',
}

const isIdentifier = (node: ESTree.Node, name: string): node is ESTree.Identifier => {
  return node.type === 'Identifier' && node.name === name
}

const isImportMeta = (node: ESTree.Node): node is ESTree.MetaProperty => {
  return node.type === 'MetaProperty' && isIdentifier(node.meta, 'import') && isIdentifier(node.property, 'meta')
}

const isImportMetaResolveCall = (node: ESTree.Expression | ESTree.SpreadElement): boolean => {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    isImportMeta(node.callee.object) &&
    isIdentifier(node.callee.property, 'resolve')
  )
}

const isMainOpenUriCall = (node: ESTree.SimpleCallExpression): boolean => {
  return (
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    isIdentifier(node.callee.object, 'Main') &&
    isIdentifier(node.callee.property, 'openUri')
  )
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: ESTree.SimpleCallExpression): void {
      const [uri] = node.arguments
      if (!isMainOpenUriCall(node) || !uri || !isImportMetaResolveCall(uri)) {
        return
      }
      context.report({
        messageId: 'noInlineImportMetaResolveInOpenUri',
        node: uri,
      })
    },
  }
}
