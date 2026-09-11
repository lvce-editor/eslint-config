import type { Rule, Scope, SourceCode } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require static mergeClassNames calls inside functions to be hoisted to module scope',
  },
  messages: {
    hoistClassNames: 'Hoist this static mergeClassNames call to module scope.',
  },
  type: 'suggestion',
}

const findVariable = (sourceCode: SourceCode, node: ESTree.Identifier): Scope.Variable | undefined => {
  let scope: Scope.Scope | null = sourceCode.getScope(node)
  while (scope) {
    const variable = scope.set.get(node.name)
    if (variable) {
      return variable
    }
    scope = scope.upper
  }
  return undefined
}

const isMergeClassNames = (sourceCode: SourceCode, node: ESTree.Expression | ESTree.Super): boolean => {
  if (node.type === 'Identifier') {
    return Boolean(
      findVariable(sourceCode, node)?.defs.some((definition) => {
        return (
          definition.type === 'ImportBinding' &&
          definition.node.type === 'ImportSpecifier' &&
          (definition.node.imported.type === 'Identifier' ? definition.node.imported.name : definition.node.imported.value) === 'mergeClassNames'
        )
      }),
    )
  }
  if (
    node.type !== 'MemberExpression' ||
    node.computed ||
    node.optional ||
    node.object.type !== 'Identifier' ||
    node.property.type !== 'Identifier' ||
    node.property.name !== 'mergeClassNames'
  ) {
    return false
  }
  return Boolean(
    findVariable(sourceCode, node.object)?.defs.some((definition) => {
      return definition.type === 'ImportBinding' && definition.node.type === 'ImportNamespaceSpecifier'
    }),
  )
}

const isStatic = (sourceCode: SourceCode, node: ESTree.Node, seen = new Set<Scope.Variable>()): boolean => {
  switch (node.type) {
    case 'BinaryExpression':
      return node.operator === '+' && isStatic(sourceCode, node.left, seen) && isStatic(sourceCode, node.right, seen)
    case 'Identifier': {
      const variable = findVariable(sourceCode, node)
      if (!variable || variable.scope.type !== 'module' || seen.has(variable)) {
        return false
      }
      const definition = variable.defs[0]
      if (definition?.type !== 'Variable' || definition.parent.kind !== 'const' || !definition.node.init) {
        return false
      }
      return isStatic(sourceCode, definition.node.init, new Set([...seen, variable]))
    }
    case 'Literal':
      return typeof node.value === 'string'
    case 'MemberExpression': {
      // Class-name modules export constants. Do not assume arbitrary object properties are immutable.
      if (node.computed || node.optional || node.object.type !== 'Identifier') {
        return false
      }
      const variable = findVariable(sourceCode, node.object)
      return Boolean(
        variable?.defs.some((definition) => {
          if (definition.type !== 'ImportBinding') {
            return false
          }
          if (definition.node.type === 'ImportNamespaceSpecifier') {
            return /(?:^|\/)ClassNames\.(?:js|ts)$/.test(String(definition.parent.source.value))
          }
          return (
            definition.node.type === 'ImportSpecifier' &&
            definition.node.imported.type === 'Identifier' &&
            definition.node.imported.name === 'ClassNames' &&
            definition.parent.source.value === '@lvce-editor/virtual-dom-worker'
          )
        }),
      )
    }
    case 'TemplateLiteral':
      return node.expressions.every((expression) => isStatic(sourceCode, expression, seen))
    default:
      return false
  }
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: ESTree.CallExpression): void {
      if (node.type !== 'CallExpression' || node.optional || !isMergeClassNames(context.sourceCode, node.callee)) {
        return
      }
      if (
        context.sourceCode.getAncestors(node).every((ancestor) => {
          return !['ArrowFunctionExpression', 'FunctionDeclaration', 'FunctionExpression'].includes(ancestor.type)
        })
      ) {
        return
      }
      if (node.arguments.some((argument) => !isStatic(context.sourceCode, argument))) {
        return
      }
      context.report({ messageId: 'hoistClassNames', node })
    },
  }
}
