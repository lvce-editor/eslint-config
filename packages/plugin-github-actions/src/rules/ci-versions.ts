import type { Rule } from 'eslint'
import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'
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
  docs: {
    description: 'Disallow unsupported ci versions',
  },

  messages: {
    unsupportedCiVersion: 'Unsupported ci version: {{value}}',
  },

  type: 'problem',
}

export const create = (context: Rule.RuleContext): Record<string, (node: AST.YAMLScalar) => void> => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }
  const checks = [
    {
      isSupported: isSupportedUbuntuVersion,
      parseVersion: parseUbuntuVersion,
      prefix: `${platforms.ubuntu}-`,
    },
    {
      isSupported: isSupportedMacosversion,
      parseVersion: parseMacosVersion,
      prefix: `${platforms.macos}-`,
    },
    {
      isSupported: isSupportedWindowsVersion,
      parseVersion: parseWindowsVersion,
      prefix: `${platforms.windows}-`,
    },
  ]

  return {
    YAMLScalar(node: AST.YAMLScalar): void {
      if (node && node.type === 'YAMLScalar' && typeof node.value === 'string') {
        for (const check of checks) {
          if (!node.value.startsWith(check.prefix)) {
            continue
          }
          const version = check.parseVersion(node.value)
          const isSupported = check.isSupported(version)
          if (!isSupported) {
            context.report({
              data: {
                value: node.value,
              },
              messageId: 'unsupportedCiVersion',
              node,
            })
          }
        }
      }
    },
  }
}
