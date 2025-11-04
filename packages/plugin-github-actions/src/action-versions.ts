import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { actions } from './config.ts'

const isSupported = (actions: readonly string[], value: string): boolean => {
  return actions.includes(value)
}

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow unsupported action versions',
  },

  messages: {
    unsupportedActionVersion: 'Unsupported action version: {{value}}',
  },
  fixable: 'code',
}

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
                value: nodeValue,
              },
              fix(fixer) {
                const validText = value.at(-1) || ''
                return fixer.replaceText(node.value, validText)
              },
            })
          }
        }
      }
    },
  }
}
