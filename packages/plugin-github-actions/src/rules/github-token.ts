import type { Rule } from 'eslint'
import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow unsupported github token values',
  },

  messages: {
    unsupportedGithubToken: 'Unsupported github token value: {{value}}',
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
        node.key.value === 'GITHUB_TOKEN' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type === 'YAMLScalar'
      ) {
        const nodeValue = node.value.value
        if (typeof nodeValue !== 'string' || nodeValue !== '${{ secrets.GITHUB_TOKEN }}') {
          context.report({
            data: {
              value: nodeValue,
            },
            messageId: 'unsupportedGithubToken',
            node,
          })
        }
      }
    },
  }
}
