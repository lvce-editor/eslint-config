import type { Rule, Scope } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require awaited OPFS entry deletion and writable closure in finally blocks',
  },
  messages: {
    cleanup: 'Protect OPFS creation with try/finally and await removal of the matching entry (recursive for directories) in finally.',
    close: 'Protect the OPFS writable with try/finally and await its close() in finally.',
  },
  schema: [],
  type: 'problem',
}

type Call = ESTree.SimpleCallExpression

const getMethod = (node: Call): string | undefined => {
  const { callee } = node
  if (callee.type !== 'MemberExpression') {
    return undefined
  }
  if (!callee.computed && callee.property.type === 'Identifier') {
    return callee.property.name
  }
  return callee.property.type === 'Literal' && typeof callee.property.value === 'string' ? callee.property.value : undefined
}

const getVariable = (context: Rule.RuleContext, node: ESTree.Identifier): Scope.Variable | undefined => {
  let scope: Scope.Scope | null = context.sourceCode.getScope(node)
  while (scope) {
    const variable = scope.set.get(node.name)
    if (variable) {
      return variable
    }
    scope = scope.upper
  }
  return undefined
}

const getInitializer = (context: Rule.RuleContext, node: ESTree.Identifier): ESTree.Expression | undefined => {
  const variable = getVariable(context, node)
  const definition = variable?.defs[0]
  if (definition?.type !== 'Variable' || variable?.references.some((reference) => reference.isWrite() && !reference.init)) {
    return undefined
  }
  return definition.node.init ?? undefined
}

const unwrapAwait = (node: ESTree.Expression): ESTree.Expression => (node.type === 'AwaitExpression' ? node.argument : node)

const sameValue = (context: Rule.RuleContext, left: ESTree.Node, right: ESTree.Node): boolean => {
  if (left.type === 'Identifier' && right.type === 'Identifier') {
    const variable = getVariable(context, left)
    return (
      variable !== undefined &&
      variable === getVariable(context, right) &&
      variable.references.every((reference) => !(reference.isWrite() && !reference.init))
    )
  }
  return left.type === 'Literal' && right.type === 'Literal' && left.value === right.value
}

const getDirectoryPath = (context: Rule.RuleContext, node: ESTree.Expression, seen = new Set<ESTree.Node>()): readonly ESTree.Node[] => {
  if (seen.has(node) || node.type !== 'Identifier') {
    return [node]
  }
  seen.add(node)
  const initializer = getInitializer(context, node)
  if (!initializer) {
    return [node]
  }
  const value = unwrapAwait(initializer)
  if (value.type === 'Identifier') {
    return getDirectoryPath(context, value, seen)
  }
  if (value.type === 'CallExpression' && getMethod(value) === 'getDirectoryHandle' && value.callee.type === 'MemberExpression') {
    const [name] = value.arguments
    if (name) {
      return [...getDirectoryPath(context, value.callee.object as ESTree.Expression, seen), name]
    }
  }
  return [node]
}

const hasTrueOption = (node: ESTree.Node | undefined, name: string): boolean => {
  return (
    node?.type === 'ObjectExpression' &&
    node.properties.some(
      (property) =>
        property.type === 'Property' &&
        ((property.key.type === 'Identifier' && property.key.name === name) || (property.key.type === 'Literal' && property.key.value === name)) &&
        property.value.type === 'Literal' &&
        property.value.value === true,
    )
  )
}

const mayCreateEntry = (options: ESTree.Node | undefined): boolean => {
  if (!options) {
    return false
  }
  if (options.type !== 'ObjectExpression') {
    return true
  }
  return options.properties.some((property) => {
    if (property.type === 'SpreadElement') {
      return true
    }
    const isCreate =
      property.key.type === 'Identifier' ? property.key.name === 'create' : property.key.type === 'Literal' && property.key.value === 'create'
    return isCreate && !(property.value.type === 'Literal' && property.value.value === false)
  })
}

const getAwaitedCalls = (block: ESTree.BlockStatement): readonly Call[] => {
  const calls: Call[] = []
  for (const statement of block.body) {
    if (statement.type === 'ExpressionStatement' && statement.expression.type === 'AwaitExpression') {
      const { argument } = statement.expression
      if (argument.type === 'CallExpression') {
        calls.push(argument)
      }
      continue
    }
    // A nested finally also runs if an earlier cleanup rejects.
    if (statement.type === 'TryStatement' && statement.finalizer) {
      calls.push(...getAwaitedCalls(statement.block), ...getAwaitedCalls(statement.finalizer))
    }
    // Conditional, deferred or unreachable cleanup is not a teardown guarantee.
    break
  }
  return calls
}

const isFunction = (node: ESTree.Node): boolean => {
  return ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.type)
}

const getFinalizers = (context: Rule.RuleContext, node: Call): readonly ESTree.BlockStatement[] => {
  const ancestors = context.sourceCode.getAncestors(node)
  const functionIndex = ancestors.findLastIndex(isFunction)
  const localAncestors = ancestors.slice(functionIndex + 1)
  const finalizers = localAncestors.flatMap((ancestor) => {
    return ancestor.type === 'TryStatement' && ancestor.finalizer && localAncestors.includes(ancestor.block) ? [ancestor.finalizer] : []
  })
  const declarationIndex = ancestors.findLastIndex((ancestor) => ancestor.type === 'VariableDeclaration')
  const declaration = ancestors[declarationIndex]
  const parentBlock = ancestors[declarationIndex - 1]
  if (
    declaration?.type === 'VariableDeclaration' &&
    declaration.declarations.length === 1 &&
    declaration.declarations[0].init &&
    unwrapAwait(declaration.declarations[0].init) === node &&
    parentBlock?.type === 'BlockStatement'
  ) {
    const next = parentBlock.body[parentBlock.body.indexOf(declaration) + 1]
    if (next?.type === 'TryStatement' && next.finalizer) {
      finalizers.push(next.finalizer)
    }
  }
  return finalizers
}

const matchesRemoval = (context: Rule.RuleContext, creation: Call, removal: Call): boolean => {
  if (getMethod(removal) !== 'removeEntry' || creation.callee.type !== 'MemberExpression' || removal.callee.type !== 'MemberExpression') {
    return false
  }
  const [name] = creation.arguments
  const [removedName, options] = removal.arguments
  if (!name || !removedName) {
    return false
  }
  const createdPath = [...getDirectoryPath(context, creation.callee.object as ESTree.Expression), name]
  const removedPath = [...getDirectoryPath(context, removal.callee.object as ESTree.Expression), removedName]
  const needsRecursive = removedPath.length < createdPath.length || getMethod(creation) === 'getDirectoryHandle'
  return (
    removedPath.length <= createdPath.length &&
    removedPath.every((component, index) => sameValue(context, component, createdPath[index])) &&
    (!needsRecursive || hasTrueOption(options, 'recursive'))
  )
}

const matchesClose = (context: Rule.RuleContext, creation: Call, close: Call): boolean => {
  if (getMethod(close) !== 'close' || close.callee.type !== 'MemberExpression' || close.callee.object.type !== 'Identifier') {
    return false
  }
  const initializer = getInitializer(context, close.callee.object)
  return initializer !== undefined && unwrapAwait(initializer) === creation
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: Call): void {
      const method = getMethod(node)
      const isWritable = method === 'createWritable'
      const createsEntry = ['getFileHandle', 'getDirectoryHandle'].includes(method ?? '') && mayCreateEntry(node.arguments[1])
      if (!isWritable && !createsEntry) {
        return
      }
      const parent = context.sourceCode.getAncestors(node).at(-1)
      if (parent?.type !== 'AwaitExpression') {
        context.report({ messageId: isWritable ? 'close' : 'cleanup', node })
        return
      }
      const finalizers = getFinalizers(context, node)
      const matches = isWritable ? matchesClose : matchesRemoval
      if (finalizers.some((finalizer) => getAwaitedCalls(finalizer).some((cleanup) => matches(context, node, cleanup)))) {
        return
      }
      context.report({ messageId: isWritable ? 'close' : 'cleanup', node })
    },
  }
}
