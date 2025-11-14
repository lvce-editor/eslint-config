import type { Rule } from 'eslint'
import { getSourceCode } from 'eslint-compat-utils'
import { existsSync } from 'fs'
import { relative, resolve } from 'path'
import type { AST } from 'yaml-eslint-parser'

export const meta: Rule.RuleMetaData = {
  type: 'problem',

  docs: {
    description: 'Disallow non-existing working directories',
  },

  messages: {
    invalidWorkingDirectory: 'Working directory not found: {{value}}',
    workingDirectoryMustBeOfTypeString: 'Working directory must be of type string',
  },
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

export const create = (context: Rule.RuleContext) => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML) {
    return {}
  }

  return {
    YAMLPair(node: AST.YAMLPair) {
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
            node,
            messageId: 'workingDirectoryMustBeOfTypeString',
            data: {
              value: nodeValue,
            },
          })
          return
        }
        const path = resolve(context.cwd, nodeValue)
        const relativePath = relative(context.cwd, path)
        if (!isAllowedNonExistingWorkingDirectory(relativePath) && !existsSync(path)) {
          context.report({
            node,
            messageId: 'invalidWorkingDirectory',
            data: {
              value: nodeValue,
            },
          })
        }
      }
    },
  }
}
