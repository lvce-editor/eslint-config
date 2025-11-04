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
    YAMLScalar(node: AST.YAMLScalar) {
      if (node && node.type === 'YAMLScalar' && typeof node.value === 'string') {
        for (const [key, value] of Object.entries(actions)) {
          if (node.value.startsWith(key) && !isSupported(value, node.value)) {
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
