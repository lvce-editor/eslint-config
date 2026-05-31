import type { Rule } from 'eslint'

const defaultMinimumVersion = '20.0.0'
const defaultMaximumVersion = '24.15.0'
const defaultBadVersions = ['24.16.0']
const versionPattern = String.raw`^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$`
const versionRegex = new RegExp(versionPattern)

interface Version {
  readonly major: number
  readonly minor: number
  readonly patch: number
  readonly text: string
}

interface RuleOptions {
  readonly minimumVersion?: string
  readonly maximumVersion?: string
  readonly badVersions?: readonly string[]
}

const parseVersion = (value: string): Version | undefined => {
  const match = versionRegex.exec(value.trim())
  if (!match) {
    return undefined
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    text: `${Number(match[1])}.${Number(match[2])}.${Number(match[3])}`,
  }
}

const compareVersion = (a: Version, b: Version): number => {
  if (a.major !== b.major) {
    return a.major - b.major
  }
  if (a.minor !== b.minor) {
    return a.minor - b.minor
  }
  return a.patch - b.patch
}

const getRuleOptions = (context: Rule.RuleContext): Required<RuleOptions> => {
  const [options = {}] = context.options as [RuleOptions?]
  return {
    minimumVersion: options.minimumVersion ?? defaultMinimumVersion,
    maximumVersion: options.maximumVersion ?? defaultMaximumVersion,
    badVersions: options.badVersions ?? defaultBadVersions,
  }
}

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow invalid or unsupported .nvmrc versions',
  },

  schema: [
    {
      type: 'object',
      additionalProperties: false,
      properties: {
        minimumVersion: {
          type: 'string',
          pattern: versionPattern,
        },
        maximumVersion: {
          type: 'string',
          pattern: versionPattern,
        },
        badVersions: {
          type: 'array',
          items: {
            type: 'string',
            pattern: versionPattern,
          },
          uniqueItems: true,
        },
      },
    },
  ],

  messages: {
    invalidVersion: 'Invalid .nvmrc version: {{value}}',
    versionTooOld: '.nvmrc version {{value}} is older than {{minimumVersion}}',
    versionTooNew: '.nvmrc version {{value}} is newer than {{maximumVersion}}',
    badVersion: '.nvmrc version {{value}} is not allowed',
  },
}

export const create = (context: Rule.RuleContext) => {
  const parserServices = context.sourceCode.parserServices
  if (!parserServices?.isNvmrc) {
    return {}
  }

  return {
    Program(node: any) {
      const value = context.sourceCode.text.trim()
      const version = parseVersion(value)
      if (!version) {
        context.report({
          node,
          messageId: 'invalidVersion',
          data: {
            value,
          },
        })
        return
      }

      const options = getRuleOptions(context)
      const minimumVersion = parseVersion(options.minimumVersion) ?? parseVersion(defaultMinimumVersion)!
      const maximumVersion = parseVersion(options.maximumVersion) ?? parseVersion(defaultMaximumVersion)!
      const badVersions = new Set(options.badVersions.map((badVersion) => parseVersion(badVersion)?.text ?? badVersion))

      if (badVersions.has(version.text)) {
        context.report({
          node,
          messageId: 'badVersion',
          data: {
            value: version.text,
          },
        })
        return
      }

      if (compareVersion(version, minimumVersion) < 0) {
        context.report({
          node,
          messageId: 'versionTooOld',
          data: {
            value: version.text,
            minimumVersion: minimumVersion.text,
          },
        })
        return
      }

      if (compareVersion(version, maximumVersion) > 0) {
        context.report({
          node,
          messageId: 'versionTooNew',
          data: {
            value: version.text,
            maximumVersion: maximumVersion.text,
          },
        })
        return
      }
    },
  }
}
