import type { Rule } from 'eslint'
import type { AST } from 'yaml-eslint-parser'
import { getSourceCode } from 'eslint-compat-utils'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require GitHub Pages deployment best practices',
  },

  messages: {
    missingGithubPagesConcurrency: 'GitHub Pages deployment requires concurrency group pages with cancel-in-progress false',
    missingGithubPagesPermissions: 'GitHub Pages deployment requires contents read, pages write, and id-token write permissions',
  },

  type: 'problem',
} as const

const isCiWorkflow = (fileName: string): boolean => {
  return fileName.endsWith('/ci.yml') || fileName.endsWith('/ci.yaml') || fileName.endsWith('\\ci.yml') || fileName.endsWith('\\ci.yaml')
}

type YamlValue = AST.YAMLContent | AST.YAMLWithMeta | null | undefined

const isYamlScalarString = (node: YamlValue, value: string): boolean => {
  return node?.type === 'YAMLScalar' && node.value === value
}

const isYamlScalarBoolean = (node: YamlValue, value: boolean): boolean => {
  return node?.type === 'YAMLScalar' && node.value === value
}

const isDeployPagesAction = (node: YamlValue): boolean => {
  return node?.type === 'YAMLScalar' && typeof node.value === 'string' && node.value.startsWith('actions/deploy-pages@')
}

const isTopLevelPair = (node: AST.YAMLPair): boolean => {
  return node.parent?.parent?.type === 'YAMLDocument'
}

const getMappingValue = (mapping: AST.YAMLMapping, key: string): YamlValue => {
  for (const pair of mapping.pairs) {
    if (pair.key?.type === 'YAMLScalar' && pair.key.value === key) {
      return pair.value
    }
  }
  return null
}

const hasGithubPagesPermissions = (mapping: AST.YAMLMapping | undefined): boolean => {
  if (!mapping) {
    return false
  }
  return (
    isYamlScalarString(getMappingValue(mapping, 'contents'), 'read') &&
    isYamlScalarString(getMappingValue(mapping, 'pages'), 'write') &&
    isYamlScalarString(getMappingValue(mapping, 'id-token'), 'write')
  )
}

const hasGithubPagesConcurrency = (mapping: AST.YAMLMapping | undefined): boolean => {
  if (!mapping) {
    return false
  }
  return isYamlScalarString(getMappingValue(mapping, 'group'), 'pages') && isYamlScalarBoolean(getMappingValue(mapping, 'cancel-in-progress'), false)
}

export const create = (context: Rule.RuleContext): Record<string, (node: AST.YAMLPair) => void> => {
  const sourceCode = getSourceCode(context)
  if (!sourceCode.parserServices?.isYAML || !isCiWorkflow(context.filename)) {
    return {}
  }

  let deployPagesNode: AST.YAMLPair | undefined
  let permissions: AST.YAMLMapping | undefined
  let concurrency: AST.YAMLMapping | undefined

  return {
    'Program:exit'(): void {
      if (!deployPagesNode) {
        return
      }
      if (!hasGithubPagesPermissions(permissions)) {
        context.report({
          messageId: 'missingGithubPagesPermissions',
          node: deployPagesNode,
        })
      }
      if (!hasGithubPagesConcurrency(concurrency)) {
        context.report({
          messageId: 'missingGithubPagesConcurrency',
          node: deployPagesNode,
        })
      }
    },

    YAMLPair(node: AST.YAMLPair): void {
      if (!node.key || node.key.type !== 'YAMLScalar' || typeof node.key.value !== 'string') {
        return
      }

      if (node.key.value === 'uses' && isDeployPagesAction(node.value)) {
        deployPagesNode = node
        return
      }

      if (!isTopLevelPair(node) || node.value?.type !== 'YAMLMapping') {
        return
      }

      if (node.key.value === 'permissions') {
        permissions = node.value
      } else if (node.key.value === 'concurrency') {
        concurrency = node.value
      }
    },
  }
}
