import type { Rule } from 'eslint'
import type { SemVer } from 'semver'
import semver from 'semver'

const defaultMinimumVersion = '20.0.0'
const defaultMaximumVersion = '24.15.0'
const defaultBadVersions = ['24.16.0']
const versionPattern = String.raw`^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$`

interface RuleOptions {
  readonly badVersions?: readonly string[]
  readonly maximumVersion?: string
  readonly minimumVersion?: string
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
    badVersions: options.badVersions ?? defaultBadVersions,
    maximumVersion: options.maximumVersion ?? defaultMaximumVersion,
    minimumVersion: options.minimumVersion ?? defaultMinimumVersion,
  }
}

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow invalid or unsupported .nvmrc versions',
  },

  messages: {
    badVersion: '.nvmrc version {{value}} is not allowed',
    invalidVersion: 'Invalid .nvmrc version: {{value}}',
    versionTooNew: '.nvmrc version {{value}} is newer than {{maximumVersion}}',
    versionTooOld: '.nvmrc version {{value}} is older than {{minimumVersion}}',
  },

  schema: [
    {
      additionalProperties: false,
      properties: {
        badVersions: {
          items: {
            pattern: versionPattern,
            type: 'string',
          },
          type: 'array',
          uniqueItems: true,
        },
        maximumVersion: {
          pattern: versionPattern,
          type: 'string',
        },
        minimumVersion: {
          pattern: versionPattern,
          type: 'string',
        },
      },
      type: 'object',
    },
  ],

  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  const { parserServices } = context.sourceCode
  if (!parserServices?.isNvmrc) {
    return {}
  }

  return {
    Program(node: any): void {
      const value = context.sourceCode.text.trim()
      const version = parseVersion(value)
      if (!version) {
        context.report({
          data: {
            value,
          },
          messageId: 'invalidVersion',
          node,
        })
        return
      }

      const options = getRuleOptions(context)
      const minimumVersion = parseVersion(options.minimumVersion) ?? parseVersion(defaultMinimumVersion)!
      const maximumVersion = parseVersion(options.maximumVersion) ?? parseVersion(defaultMaximumVersion)!
      const badVersions = new Set(options.badVersions.map((badVersion) => parseVersion(badVersion)?.version ?? badVersion))

      if (badVersions.has(version.version)) {
        context.report({
          data: {
            value: version.version,
          },
          messageId: 'badVersion',
          node,
        })
        return
      }

      if (compareVersion(version, minimumVersion) < 0) {
        context.report({
          data: {
            minimumVersion: minimumVersion.version,
            value: version.version,
          },
          messageId: 'versionTooOld',
          node,
        })
        return
      }

      if (compareVersion(version, maximumVersion) > 0) {
        context.report({
          data: {
            maximumVersion: maximumVersion.version,
            value: version.version,
          },
          messageId: 'versionTooNew',
          node,
        })
      }
    },
  }
}
