import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import type { AST } from 'yaml-eslint-parser'
import { config, platforms } from './config.ts'

const parseVersion = (value: string): string => {
  return value
}

const parseUbuntuVersion = (value: string): string => {
  return parseVersion(value)
}

const parseWindowsVersion = (value: string): string => {
  return parseVersion(value)
}

const parseMacosVersion = (value: string): string => {
  return parseVersion(value)
}

const isSupportedUbuntuVersion = (version: string): boolean => {
  return config.ubuntu.includes(version)
}

const isSupportedMacosversion = (version: string): boolean => {
  return config.macos.includes(version)
}

const isSupportedWindowsVersion = (version: string): boolean => {
  return config.windows.includes(version)
}

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow unsupported ci versions',
  },

  messages: {
    unsupportedCiVersion: 'Unsupported ci version: {{value}}',
  },
}

export const create = (context: Rule.RuleContext) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }
  const checks = [
    {
      prefix: `${platforms.ubuntu}-`,
      parseVersion: parseUbuntuVersion,
      isSupported: isSupportedUbuntuVersion,
    },
    {
      prefix: `${platforms.macos}-`,
      parseVersion: parseMacosVersion,
      isSupported: isSupportedMacosversion,
    },
    {
      prefix: `${platforms.windows}-`,
      parseVersion: parseWindowsVersion,
      isSupported: isSupportedWindowsVersion,
    },
  ]

  return {
    YAMLScalar(node: AST.YAMLScalar) {
      if (node && node.type === 'YAMLScalar' && typeof node.value === 'string') {
        for (const check of checks) {
          if (node.value.startsWith(check.prefix)) {
            const version = check.parseVersion(node.value)
            const isSupported = check.isSupported(version)
            if (!isSupported) {
              context.report({
                node,
                messageId: 'unsupportedCiVersion',
                data: {
                  value: node.value,
                },
              })
            }
          }
        }
      }
    },
  }
}
