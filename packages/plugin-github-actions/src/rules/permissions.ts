import type { Rule } from 'eslint'
import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'
import { permissions } from './config.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow unsupported permission values',
  },

  messages: {
    unsupportedPermission: 'Unsupported permission value: {{value}}',
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
        node.key.value === 'permissions' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type === 'YAMLMapping'
      ) {
        for (const pair of node.value.pairs) {
          if (!pair.key || pair.key.type !== 'YAMLScalar' || typeof pair.key.value !== 'string') {
            continue
          }
          const supportedKey = Object.hasOwn(permissions, pair.key.value)
          if (supportedKey) {
            if (pair.value && pair.value.type === 'YAMLScalar' && typeof pair.value.value === 'string') {
              const items = permissions[pair.key.value] || []
              if (!items.includes(pair.value.value)) {
                context.report({
                  data: {
                    // @ts-ignore
                    value: pair.value,
                  },
                  messageId: 'unsupportedPermission',
                  node,
                })
              }
            }
          } else {
            context.report({
              data: {
                // @ts-ignore
                value: pair,
              },
              messageId: 'unsupportedPermission',
              node: pair.key,
            })
          }
        }
      }
    },
  }
}
