import type { Rule } from 'eslint'

const isFunctionNode = (node: any): boolean => {
  return ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(node.type)
}

const isInsideFunction = (node: any): boolean => {
  let current = node.parent
  while (current) {
    if (isFunctionNode(current)) {
      return true
    }
    current = current.parent
  }
  return false
}

const isStaticRegexArgument = (node: any): boolean => {
  if (!node) {
    return true
  }
  if (node.type === 'Literal') {
    return true
  }
  if (node.type === 'TemplateLiteral') {
    return node.expressions.length === 0
  }
  return false
}

const hasOnlyStaticRegexArguments = (node: any): boolean => {
  if (!node.arguments || node.arguments.length === 0) {
    return true
  }
  return node.arguments.every(isStaticRegexArgument)
}

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Enforce hoisting regexes to module scope',
  },
  messages: {
    hoistRegex: 'Regex should be hoisted.',
  },
  type: 'suggestion',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    CallExpression(node: any): void {
      if (node.callee?.type === 'Identifier' && node.callee.name === 'RegExp' && isInsideFunction(node) && hasOnlyStaticRegexArguments(node)) {
        context.report({
          messageId: 'hoistRegex',
          node,
        })
      }
    },
    Literal(node: any): void {
      if (node.regex && isInsideFunction(node)) {
        context.report({
          messageId: 'hoistRegex',
          node,
        })
      }
    },
    NewExpression(node: any): void {
      if (node.callee?.type === 'Identifier' && node.callee.name === 'RegExp' && isInsideFunction(node) && hasOnlyStaticRegexArguments(node)) {
        context.report({
          messageId: 'hoistRegex',
          node,
        })
      }
    },
  }
}
