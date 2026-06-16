import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { findPair, getScalarStringValue, isMapping, isStepMapping } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Require explicit checkout fetch-depth',
  },

  messages: {
    missingFetchDepth: 'Missing actions/checkout fetch-depth',
  },
} as const

export const create = (context: Rule.RuleContext) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    YAMLMapping(node: AST.YAMLMapping) {
      if (!isStepMapping(node)) {
        return
      }
      const uses = findPair(node, 'uses')
      const usesValue = uses ? getScalarStringValue(uses.value) : undefined
      if (usesValue !== 'actions/checkout@v6') {
        return
      }
      const withPair = findPair(node, 'with')
      if (!withPair || !isMapping(withPair.value)) {
        context.report({
          node: uses?.value || node,
          messageId: 'missingFetchDepth',
        })
        return
      }
      if (!findPair(withPair.value, 'fetch-depth')) {
        context.report({
          node: withPair,
          messageId: 'missingFetchDepth',
        })
      }
    },
  }
}
