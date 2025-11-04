import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { actions } from './config.ts'

const isSupported = (actions: readonly string[], value: string): boolean => {
  return actions.includes(value)
}

export const meta = {
  type: 'problem',

  docs: {
    description: 'Disallow unsupported action versions',
  },

  messages: {
    unsupportedActionVersion: 'Unsupported action version: {{value}}',
  },
}

export const create = (context: any) => {
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
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type === 'YAMLScalar' &&
        typeof node.value.value === 'string'
      ) {
        const nodeValue = node.value.value
        for (const [key, value] of Object.entries(actions)) {
          if (nodeValue.startsWith(key) && !isSupported(value, nodeValue)) {
            context.report({
              node,
              messageId: 'unsupportedActionVersion',
              data: {
                value: node.value,
              },
            })
          }
        }
      }
    },
  }
}
