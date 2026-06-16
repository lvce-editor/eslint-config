import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { getPairKey, getScalarStringValue } from './ast.ts'

const secretPattern = /\${{\s*secrets\./

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow secrets directly in run commands',
  },

  messages: {
    secretInRunCommand: 'Do not reference secrets directly in run commands',
  },
} as const

export const create = (context: Rule.RuleContext) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    YAMLPair(node: AST.YAMLPair) {
      if (getPairKey(node) !== 'run') {
        return
      }
      const nodeValue = getScalarStringValue(node.value)
      if (nodeValue && secretPattern.test(nodeValue)) {
        context.report({
          node: node.value || node,
          messageId: 'secretInRunCommand',
        })
      }
    },
  }
}
