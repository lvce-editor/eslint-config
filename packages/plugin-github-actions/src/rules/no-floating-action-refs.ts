import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { getPairKey, getScalarStringValue } from './ast.ts'

const floatingRefs = new Set(['HEAD', 'latest', 'main', 'master'])

const getActionRef = (value: string): string | undefined => {
  const index = value.lastIndexOf('@')
  if (index === -1) {
    return undefined
  }
  return value.slice(index + 1)
}

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow floating action references',
  },

  messages: {
    missingActionRef: 'Missing action ref: {{value}}',
    floatingActionRef: 'Floating action ref: {{value}}',
  },
} as const

export const create = (context: Rule.RuleContext) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    YAMLPair(node: AST.YAMLPair) {
      if (getPairKey(node) !== 'uses') {
        return
      }
      const nodeValue = getScalarStringValue(node.value)
      if (!nodeValue || nodeValue.startsWith('./') || nodeValue.startsWith('docker://')) {
        return
      }
      const actionRef = getActionRef(nodeValue)
      if (!actionRef) {
        context.report({
          node: node.value || node,
          messageId: 'missingActionRef',
          data: {
            value: nodeValue,
          },
        })
        return
      }
      if (floatingRefs.has(actionRef)) {
        context.report({
          node: node.value || node,
          messageId: 'floatingActionRef',
          data: {
            value: nodeValue,
          },
        })
      }
    },
  }
}
