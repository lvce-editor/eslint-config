import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { getPairKey, getScalarStringValue, isTopLevelPair } from './ast.ts'

const workflowNames = new Map<string, string>()

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow duplicate workflow names',
  },

  messages: {
    duplicateWorkflowName: 'Duplicate workflow name: {{value}}',
  },
} as const

export const create = (context: Rule.RuleContext) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    YAMLPair(node: AST.YAMLPair) {
      if (getPairKey(node) !== 'name' || !isTopLevelPair(node)) {
        return
      }
      const nodeValue = getScalarStringValue(node.value)
      if (!nodeValue) {
        return
      }
      const existingFileName = workflowNames.get(nodeValue)
      if (existingFileName && existingFileName !== context.filename) {
        context.report({
          node: node.value || node,
          messageId: 'duplicateWorkflowName',
          data: {
            value: nodeValue,
          },
        })
        return
      }
      workflowNames.set(nodeValue, context.filename)
    },
  }
}
