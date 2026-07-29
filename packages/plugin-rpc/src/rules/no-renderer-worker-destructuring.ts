import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

const rpcRegistryModule = '@lvce-editor/rpc-registry'
const rendererWorkerName = 'RendererWorker'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow destructuring RendererWorker to preserve tree shaking',
  },
  messages: {
    noRendererWorkerDestructuring: 'Do not destructure `RendererWorker`; call its methods directly so they can be tree-shaken.',
  },
  type: 'problem',
}

const findVariable = (scope: any, name: string): any => {
  let currentScope = scope
  while (currentScope) {
    const variable = currentScope.set.get(name)
    if (variable) {
      return variable
    }
    currentScope = currentScope.upper
  }
  return undefined
}

const isImportFromRpcRegistry = (definition: any): boolean => {
  return definition.type === 'ImportBinding' && definition.parent?.source?.value === rpcRegistryModule
}

const isRendererWorkerImport = (variable: any): boolean => {
  return variable?.defs.some((definition: any) => {
    if (!isImportFromRpcRegistry(definition) || definition.node?.type !== 'ImportSpecifier') {
      return false
    }
    const { imported } = definition.node
    return imported?.name === rendererWorkerName || imported?.value === rendererWorkerName
  })
}

const isRpcRegistryNamespaceImport = (variable: any): boolean => {
  return variable?.defs.some((definition: any) => {
    return isImportFromRpcRegistry(definition) && definition.node?.type === 'ImportNamespaceSpecifier'
  })
}

const unwrapExpression = (node: any): any => {
  if (['ChainExpression', 'TSAsExpression', 'TSNonNullExpression', 'TSSatisfiesExpression', 'TSTypeAssertion'].includes(node?.type)) {
    return unwrapExpression(node.expression)
  }
  return node
}

const isRendererWorkerProperty = (node: any): boolean => {
  if (node.computed) {
    return node.property?.type === 'Literal' && node.property.value === rendererWorkerName
  }
  return node.property?.type === 'Identifier' && node.property.name === rendererWorkerName
}

const isRendererWorkerExpression = (context: Rule.RuleContext, expression: any, node: ESTree.Node): boolean => {
  const unwrappedExpression = unwrapExpression(expression)
  const scope = context.sourceCode.getScope(node)
  if (unwrappedExpression?.type === 'Identifier') {
    return isRendererWorkerImport(findVariable(scope, unwrappedExpression.name))
  }
  if (
    unwrappedExpression?.type !== 'MemberExpression' ||
    unwrappedExpression.object?.type !== 'Identifier' ||
    !isRendererWorkerProperty(unwrappedExpression)
  ) {
    return false
  }
  return isRpcRegistryNamespaceImport(findVariable(scope, unwrappedExpression.object.name))
}

const reportObjectPattern = (context: Rule.RuleContext, pattern: ESTree.ObjectPattern): void => {
  context.report({
    messageId: 'noRendererWorkerDestructuring',
    node: pattern,
  })
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    AssignmentExpression(node: ESTree.AssignmentExpression): void {
      if (node.left.type === 'ObjectPattern' && isRendererWorkerExpression(context, node.right, node)) {
        reportObjectPattern(context, node.left)
      }
    },
    VariableDeclarator(node: ESTree.VariableDeclarator): void {
      if (node.id.type === 'ObjectPattern' && isRendererWorkerExpression(context, node.init, node)) {
        reportObjectPattern(context, node.id)
      }
    },
  }
}
