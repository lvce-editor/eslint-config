import type { Rule } from 'eslint'
import { findMember, isArrayNode, isObjectNode } from './ast.ts'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow empty languages arrays in extension manifests',
  },
  messages: {
    emptyLanguages: 'extension languages array must not be empty',
  },
  type: 'problem' as const,
}

export const create = (context: Rule.RuleContext): { readonly Document: (node: any) => void } => {
  return {
    Document(node: any): void {
      if (!isObjectNode(node.body)) {
        return
      }
      const languages = findMember(node.body, 'languages')
      if (!languages || !isArrayNode(languages.value) || languages.value.elements.length > 0) {
        return
      }
      context.report({
        loc: languages.name.loc,
        messageId: 'emptyLanguages',
      })
    },
  }
}
