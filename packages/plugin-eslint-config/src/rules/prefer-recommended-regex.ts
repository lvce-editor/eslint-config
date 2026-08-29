import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

const regexPlugin = '@lvce-editor/eslint-plugin-regex'

const isRegexPlugin = (source: unknown): boolean => {
  return typeof source === 'string' && (source === regexPlugin || source.startsWith(`${regexPlugin}/`))
}

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer the shared recommendedRegex configuration over importing the regex plugin directly',
  },
  messages: {
    preferRecommendedRegex:
      'Use `config.recommendedRegex` from `@lvce-editor/eslint-config` instead of importing `@lvce-editor/eslint-plugin-regex` directly.',
  },
  type: 'suggestion',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ImportDeclaration(node: ESTree.ImportDeclaration): void {
      if (isRegexPlugin(node.source.value)) {
        context.report({
          messageId: 'preferRecommendedRegex',
          node,
        })
      }
    },
  }
}
