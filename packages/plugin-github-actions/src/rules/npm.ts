import type { Rule } from 'eslint'
import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'
import { npmCommands } from './config.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow unsupported npm commands',
  },

  messages: {
    unsupportedNpmCommand: 'Unsupported npm command: {{value}}',
  },

  type: 'problem',
} as const

const isSupportedNpmCommand = (value: string): boolean => {
  for (const npmCommand of npmCommands) {
    if (value.startsWith(npmCommand)) {
      return true
    }
  }
  return false
}

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
        node.key.value === 'run' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type === 'YAMLScalar' &&
        typeof node.value.value === 'string'
      ) {
        const nodeValue = node.value.value
        if (nodeValue.startsWith('npm ')) {
          const rest = nodeValue.slice('npm '.length)
          if (!isSupportedNpmCommand(rest)) {
            context.report({
              data: {
                value: nodeValue,
              },
              messageId: 'unsupportedNpmCommand',
              node: node.value,
            })
          }
        }
      }
    },
  }
}
