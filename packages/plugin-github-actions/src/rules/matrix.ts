import type { Rule } from 'eslint'
import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow unsupported matrix values',
  },

  messages: {
    unsupportedMatrix: 'Unsupported matrix value: {{value}}',
  },

  type: 'problem',
} as const

export const create = (context: Rule.RuleContext): Record<string, (node: AST.YAMLPair) => void> => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    YAMLPair(node: AST.YAMLPair): void {
      if (
        node &&
        node.type === 'YAMLPair' &&
        node.key &&
        typeof node.key === 'object' &&
        'type' in node.key &&
        node.key.type === 'YAMLScalar' &&
        typeof node.key.value === 'string' &&
        node.key.value === 'matrix' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type !== 'YAMLSequence'
      ) {
        context.report({
          data: {
            // @ts-ignore
            value: node.value,
          },
          messageId: 'unsupportedMatrix',
          node,
        })
      }
    },
  }
}
