import type { Rule } from 'eslint'
import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow e2e tests in release workflows',
  },

  messages: {
    noE2eInRelease: 'Do not run e2e tests in release workflows',
  },

  type: 'problem',
} as const

const isReleaseWorkflow = (filename: string): boolean => {
  const normalized = filename.replaceAll('\\', '/')
  return normalized.endsWith('/release.yml') || normalized.endsWith('/release.yaml') || normalized === 'release.yml' || normalized === 'release.yaml'
}

const runsE2eTests = (value: string): boolean => {
  const commands = value.replaceAll('\r', '\n').replaceAll('&&', ';').replaceAll('||', ';').split(/[\n;]/)
  for (const command of commands) {
    const tokens = command.trim().split(/\s+/)
    const npmIndex = tokens.indexOf('npm')
    if (npmIndex === -1) {
      continue
    }
    const scriptName = tokens[npmIndex + 2]
    if (tokens[npmIndex + 1] === 'run' && (scriptName === 'e2e' || scriptName?.startsWith('e2e:'))) {
      return true
    }
  }
  return false
}

export const create = (context: Rule.RuleContext): Record<string, (node: AST.YAMLPair) => void> => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML || !isReleaseWorkflow(context.filename)) {
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
        node.key.value === 'run' &&
        node.value &&
        typeof node.value === 'object' &&
        'type' in node.value &&
        node.value.type === 'YAMLScalar' &&
        typeof node.value.value === 'string' &&
        runsE2eTests(node.value.value)
      ) {
        context.report({
          messageId: 'noE2eInRelease',
          node: node.value,
        })
      }
    },
  }
}
