import type { Rule } from 'eslint'
import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'
import { existsSync } from 'fs'
import { relative, resolve } from 'path'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow non-existing working directories',
  },

  messages: {
    invalidWorkingDirectory: 'Working directory not found: {{value}}',
    workingDirectoryMustBeOfTypeString: 'Working directory must be of type string',
  },

  type: 'problem',
} as const

const allowedNonExistingWorkingDirectories = ['dist', '.tmp']

const isAllowedNonExistingWorkingDirectory = (relativePath: string): boolean => {
  for (const item of allowedNonExistingWorkingDirectories) {
    if (relativePath.startsWith(item)) {
      return true
    }
  }
  return false
}

export const create = (context: Rule.RuleContext): Record<string, (node: AST.YAMLPair) => void> => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    YAMLPair(node: AST.YAMLPair): void {
      if (
        node &&
        node.type === 'YAMLPair' &&
        node.key &&
        typeof node.key === 'object' &&
        'type' in node.key &&
        node.key.type === 'YAMLScalar' &&
        typeof node.key.value === 'string' &&
        node.key.value === 'working-directory' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type === 'YAMLScalar'
      ) {
        const nodeValue = node.value.value
        if (typeof nodeValue !== 'string') {
          context.report({
            data: {
              value: nodeValue,
            },
            messageId: 'workingDirectoryMustBeOfTypeString',
            node,
          })
          return
        }
        const path = resolve(context.cwd, nodeValue)
        const relativePath = relative(context.cwd, path)
        if (!isAllowedNonExistingWorkingDirectory(relativePath) && !existsSync(path)) {
          context.report({
            data: {
              value: nodeValue,
            },
            messageId: 'invalidWorkingDirectory',
            node,
          })
        }
      }
    },
  }
}
