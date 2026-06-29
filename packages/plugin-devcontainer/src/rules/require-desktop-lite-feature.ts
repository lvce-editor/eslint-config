import type { Rule } from 'eslint'
import { findMember, isObjectNode } from './ast.ts'

const desktopLiteFeature = 'ghcr.io/devcontainers/features/desktop-lite:1'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Ensure that the desktop-lite devcontainer feature is enabled',
  },
  messages: {
    featuresMustBeObject: 'devcontainer features must be an object',
    missingDesktopLiteFeature: 'desktop-lite devcontainer feature must be enabled',
    missingFeatures: 'devcontainer features must be configured',
  },
  type: 'problem' as const,
}

export const create = (context: Rule.RuleContext): { readonly Document: (node: any) => void } => {
  return {
    Document(node: any): void {
      if (!isObjectNode(node.body)) {
        context.report({
          loc: node.loc,
          messageId: 'missingFeatures',
        })
        return
      }
      const features = findMember(node.body, 'features')
      if (!features) {
        context.report({
          loc: node.body.loc,
          messageId: 'missingFeatures',
        })
        return
      }
      if (!isObjectNode(features.value)) {
        context.report({
          loc: features.name.loc,
          messageId: 'featuresMustBeObject',
        })
        return
      }
      const feature = findMember(features.value, desktopLiteFeature)
      if (!feature) {
        context.report({
          loc: features.name.loc,
          messageId: 'missingDesktopLiteFeature',
        })
      }
    },
  }
}
