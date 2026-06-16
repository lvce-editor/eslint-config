import type { Rule } from 'eslint'
import semver from 'semver'
import type { SemVer } from 'semver'

const defaultMinimumVersion = '20.0.0'
const defaultMaximumVersion = '24.15.0'
const defaultBadVersions = ['24.16.0']
const versionPattern = String.raw`^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$`

interface RuleOptions {
  readonly minimumVersion?: string
  readonly maximumVersion?: string
  readonly badVersions?: readonly string[]
}

const parseVersion = (value: string): SemVer | undefined => {
  const version = semver.parse(value.trim())
  if (!version || version.prerelease.length > 0 || version.build.length > 0) {
    return undefined
  }
  return version
}

const compareVersion = (a: SemVer, b: SemVer): number => {
  return semver.compare(a, b)
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
      const badVersions = new Set(options.badVersions.map((badVersion) => parseVersion(badVersion)?.version ?? badVersion))

      if (badVersions.has(version.version)) {
        context.report({
          node,
          messageId: 'badVersion',
          data: {
            value: version.version,
          },
        })
        return
      }

      if (compareVersion(version, minimumVersion) < 0) {
        context.report({
          node,
          messageId: 'versionTooOld',
          data: {
            value: version.version,
            minimumVersion: minimumVersion.version,
          },
        })
        return
      }

      if (compareVersion(version, maximumVersion) > 0) {
        context.report({
          node,
          messageId: 'versionTooNew',
          data: {
            value: version.version,
            maximumVersion: maximumVersion.version,
          },
        })
        return
      }
    },
  }
}
