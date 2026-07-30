import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

const githubActionsPlugin = '@lvce-editor/eslint-plugin-github-actions'

const isGithubActionsPlugin = (source: unknown): boolean => {
  return typeof source === 'string' && (source === githubActionsPlugin || source.startsWith(`${githubActionsPlugin}/`))
}

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer the shared recommendedActions configuration over importing the GitHub Actions plugin directly',
  },
  messages: {
    preferRecommendedActions:
      'Use `config.recommendedActions` from `@lvce-editor/eslint-config` instead of importing `@lvce-editor/eslint-plugin-github-actions` directly.',
  },
  type: 'suggestion',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    ImportDeclaration(node: ESTree.ImportDeclaration): void {
      if (isGithubActionsPlugin(node.source.value)) {
        context.report({
          messageId: 'preferRecommendedActions',
          node,
        })
      }
    },
  }
}
