import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer destructuring e2e test api parameters directly',
  },
  messages: {
    destructureTestApi: 'Destructure the e2e test API in the first parameter.',
    preferDirectApiDestructuring: 'Destructure the e2e test api in the parameter list instead of from api inside the function body.',
  },
  type: 'problem',
}

type FunctionNode = ESTree.ArrowFunctionExpression | ESTree.FunctionExpression | ESTree.FunctionDeclaration

interface IdentifierNode extends ESTree.BaseNode {
  name: string
  type: 'Identifier'
}

interface ObjectPatternNode extends ESTree.BaseNode {
  type: 'ObjectPattern'
}

interface VariableDeclaratorNode extends ESTree.BaseNode {
  id: unknown
  init: unknown
  type: 'VariableDeclarator'
}

const isIdentifierNode = (node: unknown): node is IdentifierNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'Identifier' && 'name' in node
}

const isObjectPatternNode = (node: unknown): node is ObjectPatternNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'ObjectPattern'
}

const isVariableDeclaratorNode = (node: unknown): node is VariableDeclaratorNode => {
  return typeof node === 'object' && node !== null && 'type' in node && node.type === 'VariableDeclarator' && 'id' in node && 'init' in node
}

const getParameterNames = (params: FunctionNode['params']): string[] => {
  return params.filter(isIdentifierNode).map((param) => param.name)
}

const isExportedTest = (node: FunctionNode, ancestors: ESTree.Node[]): boolean => {
  if (node.type === 'FunctionDeclaration') {
    return node.id?.name === 'test' && ancestors.at(-1)?.type === 'ExportNamedDeclaration'
  }
  const declarator = ancestors.at(-1)
  return (
    declarator?.type === 'VariableDeclarator' &&
    declarator.id.type === 'Identifier' &&
    declarator.id.name === 'test' &&
    ancestors.at(-2)?.type === 'VariableDeclaration' &&
    ancestors.at(-3)?.type === 'ExportNamedDeclaration'
  )
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  const functionParameterNames: string[][] = []

  const enterFunction = (node: FunctionNode): void => {
    const [parameter] = node.params
    const pattern = parameter?.type === 'AssignmentPattern' ? parameter.left : parameter
    if (pattern && pattern.type !== 'ObjectPattern' && isExportedTest(node, context.sourceCode.getAncestors(node))) {
      context.report({
        messageId: 'destructureTestApi',
        node: pattern,
      })
      functionParameterNames.push(getParameterNames(node.params.slice(1)))
      return
    }
    functionParameterNames.push(getParameterNames(node.params))
  }

  const exitFunction = (): void => {
    functionParameterNames.pop()
  }

  return {
    ArrowFunctionExpression: enterFunction,
    'ArrowFunctionExpression:exit': exitFunction,
    FunctionDeclaration: enterFunction,
    'FunctionDeclaration:exit': exitFunction,
    FunctionExpression: enterFunction,
    'FunctionExpression:exit': exitFunction,
    VariableDeclarator(node: ESTree.Node): void {
      if (!isVariableDeclaratorNode(node)) {
        return
      }
      if (!isObjectPatternNode(node.id) || !isIdentifierNode(node.init)) {
        return
      }
      const currentFunctionParameterNames = functionParameterNames.at(-1)
      if (!currentFunctionParameterNames?.includes(node.init.name)) {
        return
      }
      context.report({
        messageId: 'preferDirectApiDestructuring',
        node: node.id,
      })
    },
  }
}
