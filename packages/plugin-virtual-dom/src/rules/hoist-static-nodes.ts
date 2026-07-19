import type { Rule, Scope, SourceCode } from 'eslint'
import type * as ESTree from 'estree'
import { getProperty, hasProperty, isStringLiteral, isVirtualDomNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require static virtual-dom nodes created inside functions to be hoisted to module scope',
  },
  messages: {
    hoistStaticNode: 'Hoist this static virtual-dom node to module scope.',
  },
  type: 'suggestion',
}

const isFunctionNode = (node: ESTree.Node): boolean => {
  return ['ArrowFunctionExpression', 'FunctionDeclaration', 'FunctionExpression'].includes(node.type)
}

const findVariable = (sourceCode: SourceCode, identifier: ESTree.Identifier): Scope.Variable | undefined => {
  let scope: Scope.Scope | null = sourceCode.getScope(identifier)
  while (scope) {
    const variable = scope.set.get(identifier.name)
    if (variable) {
      return variable
    }
    scope = scope.upper
  }
  return undefined
}

const isStaticModuleVariable = (variable: Scope.Variable): boolean => {
  if (!['global', 'module'].includes(variable.scope.type)) {
    return false
  }
  return variable.defs.every((definition) => {
    if (['ClassName', 'FunctionName', 'ImportBinding'].includes(definition.type)) {
      return true
    }
    return definition.type === 'Variable' && definition.parent.kind === 'const'
  })
}

const isStaticIdentifier = (sourceCode: SourceCode, node: ESTree.Identifier): boolean => {
  const variable = findVariable(sourceCode, node)
  return Boolean(variable && isStaticModuleVariable(variable))
}

const isPropertyMutation = (sourceCode: SourceCode, identifier: ESTree.Identifier): boolean => {
  const ancestors = sourceCode.getAncestors(identifier)
  let current: ESTree.Node = identifier
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const parent = ancestors[i]
    if (parent.type === 'MemberExpression' && parent.object === current) {
      current = parent
      continue
    }
    return (
      (parent.type === 'AssignmentExpression' && parent.left === current) ||
      (parent.type === 'UpdateExpression' && parent.argument === current) ||
      (parent.type === 'UnaryExpression' && parent.operator === 'delete' && parent.argument === current)
    )
  }
  return false
}

const isMutatedVariable = (sourceCode: SourceCode, variable: Scope.Variable): boolean => {
  return variable.references.some((reference) => {
    if (!reference.init && reference.isWrite()) {
      return true
    }
    return reference.identifier.type === 'Identifier' && isPropertyMutation(sourceCode, reference.identifier)
  })
}

const isMutatedObject = (sourceCode: SourceCode, node: ESTree.ObjectExpression): boolean => {
  const parent = sourceCode.getAncestors(node).at(-1)
  if (parent?.type !== 'VariableDeclarator' || parent.init !== node || parent.id.type !== 'Identifier') {
    return false
  }
  const variable = findVariable(sourceCode, parent.id)
  return Boolean(variable && isMutatedVariable(sourceCode, variable))
}

const isVirtualDomElement = (node: ESTree.ObjectExpression): boolean => {
  if (!isVirtualDomNode(node) || !hasProperty(node, 'childCount')) {
    return false
  }
  const type = getProperty(node, 'type')
  return Boolean(type && !isStringLiteral(type.value))
}

const isStaticProperty = (sourceCode: SourceCode, node: ESTree.Property | ESTree.SpreadElement): boolean => {
  if (node.type === 'SpreadElement' || node.kind !== 'init' || node.method) {
    return false
  }
  if (node.computed && !isStaticExpression(sourceCode, node.key)) {
    return false
  }
  return isStaticExpression(sourceCode, node.value)
}

const isStaticExpression = (sourceCode: SourceCode, node: ESTree.Node | null): boolean => {
  if (!node) {
    return true
  }
  switch (node.type) {
    case 'ArrayExpression':
      return node.elements.every((element) => !element || (element.type !== 'SpreadElement' && isStaticExpression(sourceCode, element)))
    case 'BinaryExpression':
    case 'LogicalExpression':
      return isStaticExpression(sourceCode, node.left) && isStaticExpression(sourceCode, node.right)
    case 'ConditionalExpression':
      return (
        isStaticExpression(sourceCode, node.test) && isStaticExpression(sourceCode, node.consequent) && isStaticExpression(sourceCode, node.alternate)
      )
    case 'Identifier':
      return isStaticIdentifier(sourceCode, node)
    case 'Literal':
      return true
    case 'MemberExpression':
      return (
        isStaticExpression(sourceCode, node.object) &&
        (!node.computed || (node.property.type !== 'PrivateIdentifier' && isStaticExpression(sourceCode, node.property)))
      )
    case 'ObjectExpression':
      return node.properties.every((property) => isStaticProperty(sourceCode, property))
    case 'TemplateLiteral':
      return node.expressions.every((expression) => isStaticExpression(sourceCode, expression))
    case 'UnaryExpression':
      return node.operator !== 'delete' && isStaticExpression(sourceCode, node.argument)
    default:
      return false
  }
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ObjectExpression(node: ESTree.ObjectExpression): void {
      if (!isVirtualDomElement(node)) {
        return
      }
      if (!context.sourceCode.getAncestors(node).some(isFunctionNode)) {
        return
      }
      if (!isStaticExpression(context.sourceCode, node)) {
        return
      }
      if (isMutatedObject(context.sourceCode, node)) {
        return
      }
      context.report({
        messageId: 'hoistStaticNode',
        node,
      })
    },
  }
}
