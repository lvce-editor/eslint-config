import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow unsupported matrix values',
  },

  messages: {
    unsupportedMatrix: 'Unsupported matrix value: {{value}}',
  },
} as const

export const create = (context: Rule.RuleContext) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    YAMLPair(node: AST.YAMLPair) {
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
          node,
          messageId: 'unsupportedMatrix',
          data: {
            value: node.value,
          },
        })
      }
    },
  }
}
