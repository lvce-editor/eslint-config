import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { permissions } from './config.ts'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow unsupported permission values',
  },

  messages: {
    unsupportedPermission: 'Unsupported permission value: {{value}}',
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
        node.key.value === 'permissions' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type === 'YAMLMapping'
      ) {
        for (const pair of node.value.pairs) {
          if (pair.key && pair.key.type === 'YAMLScalar' && typeof pair.key.value === 'string') {
            const supportedKey = Object.hasOwn(permissions, pair.key.value)
            if (!supportedKey) {
              context.report({
                node: pair.key,
                messageId: 'unsupportedPermission',
                data: {
                  value: pair,
                },
              })
            } else {
              if (pair.value && pair.value.type === 'YAMLScalar' && typeof pair.value.value === 'string') {
                const items = permissions[pair.key.value] || []
                if (!items.includes(pair.value.value)) {
                  context.report({
                    node,
                    messageId: 'unsupportedPermission',
                    data: {
                      value: pair.value,
                    },
                  })
                }
              }
            }
          }
        }
      }
    },
  }
}
