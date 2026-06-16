import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { getPairKey, getScalarStringValue } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow write-all permissions',
  },

  messages: {
    writeAllPermissions: 'Do not use write-all permissions',
  },
} as const

export const create = (context: Rule.RuleContext) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    YAMLPair(node: AST.YAMLPair) {
      if (getPairKey(node) === 'permissions' && getScalarStringValue(node.value) === 'write-all') {
        context.report({
          node: node.value || node,
          messageId: 'writeAllPermissions',
        })
      }
    },
  }
}
