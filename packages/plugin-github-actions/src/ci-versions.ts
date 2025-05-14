import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'

const parseUbuntuVersion = (value: string): string => {
  return value.slice('ubuntu-'.length)
}

const parseWindowsVersion = (value: string): string => {
  return value.slice('windows-'.length)
}

const parseMacosVersion = (value: string): string => {
  return value.slice('macos-'.length)
}

const isSupportedUbuntuVersion = (version: string): boolean => {
  switch (version) {
    case '24.04':
      return true
    default:
      return false
  }
}

const isSupportedMacosversion = (version: string): boolean => {
  switch (version) {
    case '15':
      return true
    default:
      return false
  }
}

const isSupportedWindowsVersion = (version: string): boolean => {
  switch (version) {
    case '2025':
      return true
    default:
      return false
  }
}

export const meta = {
  type: 'problem',

  docs: {
    description: 'Disallow unsupported ci versions',
  },

  messages: {
    unsupportedCiVersion: 'Unsupported ci version: {{value}}',
  },
}

export const create = (context: any) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }
  const checks = [
    {
      prefix: 'ubuntu-',
      parseVersion: parseUbuntuVersion,
      isSupported: isSupportedUbuntuVersion,
    },
    {
      prefix: 'macos-',
      parseVersion: parseMacosVersion,
      isSupported: isSupportedMacosversion,
    },
    {
      prefix: 'windows-',
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
