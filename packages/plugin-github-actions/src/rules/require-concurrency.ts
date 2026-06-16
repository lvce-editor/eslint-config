import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { findPair, getScalarValue, getTopLevelPair, isMapping } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Require workflow concurrency cancellation',
  },

  messages: {
    missingConcurrency: 'Missing top-level concurrency with cancel-in-progress: true',
  },
} as const

const hasCancelInProgress = (node: AST.YAMLPair | undefined): boolean => {
  if (!node || !isMapping(node.value)) {
    return false
  }
  const cancelInProgress = findPair(node.value, 'cancel-in-progress')
  return getScalarValue(cancelInProgress?.value) === true
}

export const create = (context: Rule.RuleContext) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    'Program:exit'(node: AST.YAMLProgram) {
      if (!hasCancelInProgress(getTopLevelPair(node, 'concurrency'))) {
        context.report({
          node,
          messageId: 'missingConcurrency',
        })
      }
    },
  }
}
