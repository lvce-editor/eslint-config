import type { Rule } from 'eslint'

const isMockRpcVariable = (declaration: any): boolean => {
  return declaration?.id?.type === 'Identifier' && declaration.id.name === 'mockRpc'
}

const isRegisterMockRpcCall = (expression: any): boolean => {
  return (
    expression?.type === 'CallExpression' &&
    expression.callee?.type === 'MemberExpression' &&
    expression.callee.property?.type === 'Identifier' &&
    expression.callee.property.name === 'registerMockRpc'
  )
}

const shouldUseUsing = (node: any): boolean => {
  return node.declarations.some((declaration: any) => isMockRpcVariable(declaration) && isRegisterMockRpcCall(declaration.init))
}

export const meta: Rule.RuleMetaData = {
  type: 'problem',
  docs: {
    description: 'Enforce using with mockRpc registration',
  },
  messages: {
    preferUsingMockRpc: 'Use `using` with `mockRpc`.',
  },
}

export const create = (context: Rule.RuleContext) => {
  return {
    VariableDeclaration(node: any) {
      if (!shouldUseUsing(node)) {
        return
      }
      if (node.kind === 'using') {
        return
      }
      context.report({
        node,
        messageId: 'preferUsingMockRpc',
      })
    },
  }
}
