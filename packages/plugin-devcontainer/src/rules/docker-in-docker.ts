import type { Rule } from 'eslint'
import { findMember, isObjectNode, isStringNode } from './ast.ts'

// cspell:ignore moby

const dockerInDockerFeature = 'ghcr.io/devcontainers/features/docker-in-docker'
const expectedFeature = `${dockerInDockerFeature}:4`

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require docker-in-docker version 4 with moby disabled',
  },
  messages: {
    invalidVersion: 'docker-in-docker devcontainer feature must use version 4',
    mobyMustBeFalse: 'docker-in-docker devcontainer feature must configure "moby": false',
  },
  schema: [],
  type: 'problem' as const,
}

export const create = (context: Rule.RuleContext): { readonly Document: (node: any) => void } => {
  return {
    Document(node: any): void {
      const features = findMember(node.body, 'features')
      if (!features || !isObjectNode(features.value)) {
        return
      }
      for (const feature of features.value.members) {
        if (!isStringNode(feature.name)) {
          continue
        }
        const name = feature.name.value
        if (name !== dockerInDockerFeature && !name.startsWith(`${dockerInDockerFeature}:`) && !name.startsWith(`${dockerInDockerFeature}@`)) {
          continue
        }
        if (name !== expectedFeature) {
          context.report({
            loc: feature.name.loc,
            messageId: 'invalidVersion',
          })
        }
        const moby = findMember(feature.value, 'moby')
        if (!moby || moby.value.type !== 'Boolean' || moby.value.value !== false) {
          context.report({
            loc: (moby || feature).value.loc,
            messageId: 'mobyMustBeFalse',
          })
        }
      }
    },
  }
}
