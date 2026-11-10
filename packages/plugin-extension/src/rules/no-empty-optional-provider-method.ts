import type { Rule } from 'eslint'
import type * as ESTree from 'estree'
import ts from 'typescript'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Omit empty optional LVCE extension provider methods',
  },
  messages: {
    omitMethod: 'Omit optional provider method {{name}} instead of implementing it without doing any work.',
  },
  schema: [],
  type: 'suggestion',
}

const isApiProviderMember = (declaration: ts.Declaration): boolean => {
  const { parent } = declaration
  return (
    ts.isPropertySignature(declaration) &&
    !!declaration.questionToken &&
    ts.isInterfaceDeclaration(parent) &&
    parent.name.text.endsWith('Provider') &&
    declaration.getSourceFile().fileName.replaceAll('\\', '/').includes('/node_modules/@lvce-editor/api/')
  )
}

const isUndefined = (context: Rule.RuleContext, node: ESTree.Expression): boolean => {
  if (node.type === 'UnaryExpression' && node.operator === 'void' && node.argument.type === 'Literal') {
    return true
  }
  if (node.type !== 'Identifier' || node.name !== 'undefined') {
    return false
  }
  let scope = context.sourceCode.getScope(node)
  while (scope) {
    const variable = scope.set.get('undefined')
    if (variable) {
      return variable.defs.length === 0
    }
    scope = scope.upper!
  }
  return true
}

const isEmptyFunction = (context: Rule.RuleContext, node: ESTree.FunctionExpression | ESTree.ArrowFunctionExpression): boolean => {
  // Parameter initializers/destructuring and generators can do work even with an empty body.
  if (node.generator || node.params.some((parameter) => parameter.type !== 'Identifier')) {
    return false
  }
  if (node.body.type !== 'BlockStatement') {
    return isUndefined(context, node.body)
  }
  const { body } = node.body
  if (body.length === 0) {
    return true
  }
  return body.length === 1 && body[0].type === 'ReturnStatement' && (!body[0].argument || isUndefined(context, body[0].argument))
}

const getPropertyName = (node: ESTree.Property): unknown => {
  if (node.key.type === 'Identifier') {
    return node.key.name
  }
  if (node.key.type === 'Literal') {
    return node.key.value
  }
  return undefined
}

const returnsUndefined = (checker: ts.TypeChecker, property: ts.Symbol, node: ts.Node): boolean => {
  const methodType = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(property, node))
  return methodType.getCallSignatures().some((signature) => {
    const returnType = checker.getAwaitedType(checker.getReturnTypeOfSignature(signature))
    if (!returnType) {
      return false
    }
    const types = returnType.isUnion() ? returnType.types : [returnType]
    return types.some((type) => !!(type.flags & ts.TypeFlags.Undefined))
  })
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  const services = context.sourceCode.parserServices
  if (!services?.program || !services.esTreeNodeToTSNodeMap) {
    throw new Error('extension/no-empty-optional-provider-method requires TypeScript type information. Enable parserOptions.projectService.')
  }
  const checker: ts.TypeChecker = services.program.getTypeChecker()
  return {
    Property(node: ESTree.Property & { parent?: ESTree.Node }): void {
      if (
        node.parent?.type !== 'ObjectExpression' ||
        node.kind !== 'init' ||
        (node.computed && node.key.type !== 'Literal') ||
        (node.value.type !== 'FunctionExpression' && node.value.type !== 'ArrowFunctionExpression') ||
        !isEmptyFunction(context, node.value)
      ) {
        return
      }
      const name = getPropertyName(node)
      if (typeof name !== 'string') {
        return
      }
      const objectNode = services.esTreeNodeToTSNodeMap.get(node.parent) as ts.ObjectLiteralExpression
      const contextualType = checker.getContextualType(objectNode)
      // Ambiguous union contexts can require different members, so leave them alone.
      if (!contextualType || contextualType.isUnion()) {
        return
      }
      const property = contextualType.getProperty(name)
      if (
        !property ||
        !(property.flags & ts.SymbolFlags.Optional) ||
        !property.declarations?.some(isApiProviderMember) ||
        !returnsUndefined(checker, property, objectNode)
      ) {
        return
      }
      context.report({
        data: { name },
        messageId: 'omitMethod',
        node,
      })
    },
  }
}
