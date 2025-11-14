import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow unsupported timeout minute values',
  },

  messages: {
    unsupportedTimeoutMinutes: 'Unsupported timeout minutes value: {{value}}',
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
        node.key.value === 'timeout-minutes' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type === 'YAMLScalar' &&
        typeof node.value.value !== 'number'
      ) {
        const nodeValue = node.value.value
        context.report({
          node: node.value,
          messageId: 'unsupportedTimeoutMinutes',
          data: {
            value: nodeValue,
          },
        })
      }
    },
  }
}
