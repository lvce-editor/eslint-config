import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow unsupported release action usage',
  },

  messages: {
    unsupportedReleaseAction: 'Unsupported release action',
  },

  fixable: 'code',
} as const

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
        node.key.value === 'uses' &&
        node.value &&
        node.value.type === 'YAMLScalar' &&
        node.value.value === 'actions/create-release@v1'
      ) {
        context.report({
          node,
          messageId: 'unsupportedReleaseAction',
          data: {},
          fix(fixer) {
            const parent = node.parent
            for (const pair of parent.pairs) {
              if (pair.key && pair.key.type === 'YAMLScalar' && pair.key.value === 'with') {
                console.log(pair.value)
              }
            }
            console.log({ parent })
            // const validText = value.at(-1) || ''
            // return fixer.replaceText(node.value, validText)
          },
        })
        console.log(node)
      }
    },
  }
}
