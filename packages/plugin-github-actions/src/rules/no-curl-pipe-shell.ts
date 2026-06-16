import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { getPairKey, getScalarStringValue } from './ast.ts'

const curlPipeShellPattern = /\b(curl|wget)\b[\s\S]*\|[\s\S]*\b(ba)?sh\b/

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow piping downloaded scripts to shell',
  },

  messages: {
    curlPipeShell: 'Do not pipe downloaded scripts directly to shell',
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
      if (nodeValue && curlPipeShellPattern.test(nodeValue)) {
        context.report({
          node: node.value || node,
          messageId: 'curlPipeShell',
        })
      }
    },
  }
}
