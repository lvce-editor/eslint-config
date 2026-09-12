import type { Rule } from 'eslint'
import { subset, validRange } from 'semver'

const defaultRestrictions: Readonly<Record<string, string | false>> = {
  eslint: '<10.10.0-0',
  typescript: '>=6.0.0-0 <7.0.0-0',
}
const dependencySections = new Set(['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'])

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow dependencies and version ranges outside the supported versions',
  },
  messages: {
    forbidden: 'Dependency "{{name}}" is not allowed.',
    unsupported: 'Dependency "{{name}}" must use a version range within "{{allowed}}"; received "{{version}}".',
  },
  schema: [
    {
      additionalProperties: false,
      properties: {
        restrictions: {
          additionalProperties: {
            anyOf: [{ type: 'string', minLength: 1 }, { enum: [false] }],
          },
          type: 'object',
        },
      },
      type: 'object',
    },
  ],
  type: 'problem',
}

export const create = (context: Rule.RuleContext): { readonly Document: (node: any) => void } => {
  const restrictions: Readonly<Record<string, string | false>> = { ...defaultRestrictions, ...context.options[0]?.restrictions }
  for (const [name, allowed] of Object.entries(restrictions)) {
    if (allowed !== false && !validRange(allowed)) {
      throw new Error(`Invalid allowed version range for dependency "${name}": ${allowed}`)
    }
  }
  return {
    Document(node: any): void {
      if (node.body?.type !== 'Object') {
        return
      }
      for (const section of node.body.members) {
        if (!dependencySections.has(section.name.value) || section.value.type !== 'Object') {
          continue
        }
        for (const dependency of section.value.members) {
          const name = dependency.name.value
          if (!Object.hasOwn(restrictions, name)) {
            continue
          }
          const allowed = restrictions[name]
          if (allowed === false) {
            context.report({ loc: dependency.name.loc, messageId: 'forbidden', data: { name } })
            continue
          }
          const version = dependency.value.value
          if (typeof version !== 'string' || !validRange(version) || !subset(version, allowed, { includePrerelease: true })) {
            context.report({
              loc: dependency.value.loc,
              messageId: 'unsupported',
              data: { name, allowed, version: String(version) },
            })
          }
        }
      }
    },
  }
}
