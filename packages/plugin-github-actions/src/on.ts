import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { onProperties } from './config.ts'

export const meta = {
  type: 'problem',

  docs: {
    description: 'Disallow unsupported on values',
  },

  messages: {
    unsupportedOn: 'Unsupported on value: {{value}}',
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
        node.key.value === 'on' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type === 'YAMLMapping'
      ) {
        const pairs = node.value.pairs
        for (const pair of pairs) {
          if (pair.key && pair.key.type === 'YAMLScalar' && typeof pair.key.value === 'string' && !onProperties.includes(pair.key.value)) {
            context.report({
              node,
              messageId: 'unsupportedOn',
              data: {
                value: pair.key.value,
              },
            })
          }
        }
      }
    },
  }
}
