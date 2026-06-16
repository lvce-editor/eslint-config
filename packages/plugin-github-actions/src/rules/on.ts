import type { Rule } from 'eslint'
import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'
import { onProperties } from './config.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow unsupported on values',
  },

  messages: {
    unsupportedOn: 'Unsupported on value: {{value}}',
  },

  type: 'problem',
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
        const {pairs} = node.value
        for (const pair of pairs) {
          if (pair.key && pair.key.type === 'YAMLScalar' && typeof pair.key.value === 'string' && !onProperties.includes(pair.key.value)) {
            context.report({
              data: {
                value: pair.key.value,
              },
              messageId: 'unsupportedOn',
              node,
            })
          }
        }
      }
    },
  }
}
