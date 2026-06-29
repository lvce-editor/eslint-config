import type { Rule } from 'eslint'
import { findMember, isObjectNode, isStringNode } from './ast.ts'

export const defaultAllowedImages = ['mcr.microsoft.com/devcontainers/javascript-node:24']

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Ensure that the devcontainer image is allowed',
  },
  messages: {
    imageMustBeString: 'devcontainer image must be a string',
    missingImage: 'devcontainer image must be configured',
    unsupportedImage: 'Unsupported devcontainer image: {{image}}',
  },
  schema: [
    {
      additionalProperties: false,
      properties: {
        allowedImages: {
          items: {
            type: 'string',
          },
          type: 'array',
          uniqueItems: true,
        },
      },
      type: 'object',
    },
  ],
  type: 'problem' as const,
}

const getAllowedImages = (context: Rule.RuleContext): readonly string[] => {
  const [options] = context.options
  if (options && typeof options === 'object' && Array.isArray(options.allowedImages)) {
    return options.allowedImages
  }
  return defaultAllowedImages
}

export const create = (context: Rule.RuleContext): { readonly Document: (node: any) => void } => {
  const allowedImages = new Set(getAllowedImages(context))

  return {
    Document(node: any): void {
      if (!isObjectNode(node.body)) {
        context.report({
          loc: node.loc,
          messageId: 'missingImage',
        })
        return
      }
      const image = findMember(node.body, 'image')
      if (!image) {
        context.report({
          loc: node.body.loc,
          messageId: 'missingImage',
        })
        return
      }
      if (!isStringNode(image.value)) {
        context.report({
          loc: image.name.loc,
          messageId: 'imageMustBeString',
        })
        return
      }
      if (!allowedImages.has(image.value.value)) {
        context.report({
          data: {
            image: image.value.value,
          },
          loc: image.name.loc,
          messageId: 'unsupportedImage',
        })
      }
    },
  }
}
