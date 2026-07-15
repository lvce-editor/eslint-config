import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require Intl.DateTimeFormat instances to be created lazily',
  },
  messages: {
    preferLazyDateTimeFormat: 'Create Intl.DateTimeFormat instances lazily.',
  },
  type: 'suggestion',
}

const isFunctionNode = (node: ESTree.Node): boolean => {
  return ['ArrowFunctionExpression', 'FunctionDeclaration', 'FunctionExpression'].includes(node.type)
}

const isDateTimeFormat = (node: ESTree.Expression | ESTree.Super): boolean => {
  return (
    node.type === 'MemberExpression' &&
    !node.computed &&
    node.object.type === 'Identifier' &&
    node.object.name === 'Intl' &&
    node.property.type === 'Identifier' &&
    node.property.name === 'DateTimeFormat'
  )
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  const isCreatedLazily = (node: ESTree.Node): boolean => {
    return context.sourceCode.getAncestors(node).some(isFunctionNode)
  }

  const reportEagerDateTimeFormat = (node: ESTree.NewExpression | ESTree.SimpleCallExpression): void => {
    if (!isDateTimeFormat(node.callee) || isCreatedLazily(node)) {
      return
    }
    context.report({
      messageId: 'preferLazyDateTimeFormat',
      node,
    })
  }

  return {
    CallExpression: reportEagerDateTimeFormat,
    NewExpression: reportEagerDateTimeFormat,
  }
}
