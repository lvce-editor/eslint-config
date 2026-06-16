import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { findPair, getScalarStringValue, getScalarValue, isMapping, isStepMapping } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Require checkout persist-credentials to be false',
  },

  messages: {
    missingPersistCredentials: 'Missing actions/checkout persist-credentials: false',
    unsupportedPersistCredentials: 'Unsupported actions/checkout persist-credentials value',
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
          messageId: 'missingPersistCredentials',
        })
        return
      }
      const persistCredentials = findPair(withPair.value, 'persist-credentials')
      if (!persistCredentials) {
        context.report({
          node: withPair,
          messageId: 'missingPersistCredentials',
        })
        return
      }
      if (getScalarValue(persistCredentials.value) !== false) {
        context.report({
          node: persistCredentials.value || persistCredentials,
          messageId: 'unsupportedPersistCredentials',
        })
      }
    },
  }
}
