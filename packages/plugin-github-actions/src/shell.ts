import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { shells } from './config.ts'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow unsupported shell values',
  },

  messages: {
    unsupportedShell: 'Unsupported shell value: {{value}}',
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
        node.key.value === 'shell' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type === 'YAMLScalar'
      ) {
        const nodeValue = node.value.value
        if (typeof nodeValue !== 'string' || !shells.includes(nodeValue)) {
          context.report({
            node,
            messageId: 'unsupportedShell',
            data: {
              value: nodeValue,
            },
          })
        }
      }
    },
  }
}
