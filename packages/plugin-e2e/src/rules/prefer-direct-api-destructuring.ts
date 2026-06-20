import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer destructuring e2e test api parameters directly',
  },
  messages: {
    preferDirectApiDestructuring: 'Destructure the e2e test api in the parameter list instead of from api inside the function body.',
  },
  type: 'problem',
}

interface FunctionNode extends ESTree.BaseNode {
  params: readonly unknown[]
}

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

const getParameterNames = (node: FunctionNode): readonly string[] => {
  return node.params.filter(isIdentifierNode).map((param) => param.name)
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  const functionParameterNames: string[][] = []

  const enterFunction = (node: FunctionNode): void => {
    functionParameterNames.push([...getParameterNames(node)])
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
