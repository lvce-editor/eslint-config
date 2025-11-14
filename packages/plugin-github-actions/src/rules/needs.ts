import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow unsupported needs values',
  },

  messages: {
    unsupportedNeeds: 'Unsupported needs value: {{value}}',
  },
} as const

const stringifyValue = (
  node:
    | AST.YAMLAlias
    | AST.YAMLBlockFoldedScalar
    | AST.YAMLBlockLiteralScalar
    | AST.YAMLBlockMapping
    | AST.YAMLBlockSequence
    | AST.YAMLDoubleQuotedScalar
    | AST.YAMLFlowMapping
    | AST.YAMLFlowSequence
    | AST.YAMLPlainScalar
    | AST.YAMLSingleQuotedScalar
    | AST.YAMLWithMeta
    | null,
): string => {
  if (!node) {
    return ''
  }
  if (node.type === 'YAMLScalar') {
    return `${node.value}`
  }
  return `${node.type}`
}

const getValidNeeds = (node: AST.YAMLPair): readonly string[] => {
  const greatGrandParent = node.parent.parent.parent
  const validNeeds: string[] = []

  if (greatGrandParent.type === 'YAMLMapping') {
    const pairs = greatGrandParent.pairs
    for (const pair of pairs) {
      if (pair.key && pair.key.type === 'YAMLScalar' && typeof pair.key.value === 'string') {
        validNeeds.push(pair.key.value)
      }
    }
  }
  return validNeeds
}

export const create = (context: Rule.RuleContext) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    YAMLPair(node: AST.YAMLPair) {
      if (
        node &&
        node.type === 'YAMLPair' &&
        node.key &&
        typeof node.key === 'object' &&
        'type' in node.key &&
        node.key.type === 'YAMLScalar' &&
        typeof node.key.value === 'string' &&
        node.key.value === 'needs' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value
      ) {
        const validNeeds = getValidNeeds(node)

        if (node.value.type === 'YAMLScalar' && typeof node.value.value === 'string') {
          if (!validNeeds.includes(node.value.value)) {
            context.report({
              node,
              messageId: 'unsupportedNeeds',
              data: {
                value: stringifyValue(node.value),
              },
            })
          }
          return
        }

        if (node.value.type === 'YAMLSequence') {
          for (const item of node.value.entries) {
            if (!item || item.type !== 'YAMLScalar' || typeof item.value !== 'string') {
              context.report({
                node,
                messageId: 'unsupportedNeeds',
                data: {
                  value: stringifyValue(item),
                },
              })
              continue
            }
            if (!validNeeds.includes(item.value)) {
              context.report({
                node,
                messageId: 'unsupportedNeeds',
                data: {
                  value: stringifyValue(item),
                },
              })
            }
          }
          return
        }

        context.report({
          node,
          messageId: 'unsupportedNeeds',
          data: {
            value: stringifyValue(node.value),
          },
        })
      }
    },
  }
}
