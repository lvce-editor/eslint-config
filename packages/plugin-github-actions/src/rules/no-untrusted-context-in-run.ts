import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { getPairKey, getScalarStringValue } from './ast.ts'

const untrustedContextPattern =
  /\${{\s*(github\.event\.(pull_request|issue|comment|review|discussion|head_commit|commits)\b|github\.(head_ref|ref_name)\b)/

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow untrusted github contexts in run commands',
  },

  messages: {
    untrustedContextInRun: 'Untrusted github context in run command',
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
      if (nodeValue && untrustedContextPattern.test(nodeValue)) {
        context.report({
          node: node.value || node,
          messageId: 'untrustedContextInRun',
        })
      }
    },
  }
}
