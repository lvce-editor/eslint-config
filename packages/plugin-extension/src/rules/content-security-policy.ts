import type { Rule } from 'eslint'
import { findMember, isArrayNode, isObjectNode, isStringNode } from './ast.ts'

const requiredFirstDirective = "default-src 'none'"

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require a secure content security policy for extension workers',
  },
  messages: {
    insecureContentSecurityPolicy: `extension contentSecurityPolicy must start with ${requiredFirstDirective}`,
    invalidContentSecurityPolicy: 'extension contentSecurityPolicy must be an array of strings',
    missingContentSecurityPolicy: 'extensions with a main entry must configure contentSecurityPolicy',
  },
  type: 'problem' as const,
}

const hasMainEntry = (manifest: any): boolean => {
  return Boolean(findMember(manifest, 'browser') || findMember(manifest, 'main'))
}

const isValidPolicyArray = (node: any): boolean => {
  return isArrayNode(node) && node.elements.every((element: any) => isStringNode(element.value))
}

export const create = (context: Rule.RuleContext): { readonly Document: (node: any) => void } => {
  return {
    Document(node: any): void {
      if (!isObjectNode(node.body)) {
        return
      }
      const contentSecurityPolicy = findMember(node.body, 'contentSecurityPolicy')
      if (!contentSecurityPolicy) {
        if (hasMainEntry(node.body)) {
          context.report({
            loc: node.body.loc,
            messageId: 'missingContentSecurityPolicy',
          })
        }
        return
      }
      if (!isValidPolicyArray(contentSecurityPolicy.value)) {
        context.report({
          loc: contentSecurityPolicy.name.loc,
          messageId: 'invalidContentSecurityPolicy',
        })
        return
      }
      const [firstDirective] = contentSecurityPolicy.value.elements
      if (!firstDirective || firstDirective.value.value !== requiredFirstDirective) {
        context.report({
          loc: contentSecurityPolicy.name.loc,
          messageId: 'insecureContentSecurityPolicy',
        })
      }
    },
  }
}
