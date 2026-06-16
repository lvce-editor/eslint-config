import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { getTopLevelPair } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Require explicit top-level permissions',
  },

  messages: {
    missingPermissions: 'Missing top-level permissions',
  },
} as const

export const create = (context: Rule.RuleContext) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    'Program:exit'(node: AST.YAMLProgram) {
      if (!getTopLevelPair(node, 'permissions')) {
        context.report({
          node,
          messageId: 'missingPermissions',
        })
      }
    },
  }
}
