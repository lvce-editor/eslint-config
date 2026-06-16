import type { Rule } from 'eslint'
import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'
import { pythonVersions } from './config.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow unsupported python versions',
  },

  messages: {
    unsupportedPythonVersion: 'Unsupported python version: {{value}}',
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
        node.key.value === 'python-version' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type === 'YAMLScalar'
      ) {
        const nodeValue = node.value.value
        if (typeof nodeValue !== 'string' || !pythonVersions.includes(nodeValue)) {
          context.report({
            data: {
              value: nodeValue,
            },
            messageId: 'unsupportedPythonVersion',
            node,
          })
        }
      }
    },
  }
}
