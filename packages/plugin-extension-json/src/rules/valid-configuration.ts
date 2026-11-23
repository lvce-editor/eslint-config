import type { JSONRuleVisitor } from '@eslint/json'
import type { Rule } from 'eslint'
import { findMember, isObjectNode } from './ast.ts'

type DocumentNode = Parameters<NonNullable<JSONRuleVisitor['Document']>>[0]
type ValueNode = DocumentNode['body']

const settingTypes = new Set(['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'])

const isSettingType = (node: ValueNode): boolean => {
  return node.type === 'String' && settingTypes.has(node.value)
}

const isValidType = (node: ValueNode): boolean => {
  if (node.type !== 'Array') {
    return isSettingType(node)
  }
  const types = new Set<string>()
  for (const { value } of node.elements) {
    if (value.type !== 'String' || !settingTypes.has(value.value) || types.has(value.value)) {
      return false
    }
    types.add(value.value)
  }
  return types.size > 0
}

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require valid configuration setting declarations in extension manifests',
  },
  messages: {
    invalidConfiguration: 'Extension configuration must be an object that maps setting names to schemas.',
    invalidSetting: 'Extension setting schema must be an object.',
    invalidType: 'Extension setting type must be a JSON Schema type or a non-empty array of distinct JSON Schema types.',
  },
  type: 'problem' as const,
}

export const create = (context: Rule.RuleContext): JSONRuleVisitor => {
  return {
    Document(node): void {
      const configuration = findMember(node.body, 'configuration')
      if (!configuration) {
        return
      }
      if (!isObjectNode(configuration.value)) {
        context.report({ loc: configuration.value.loc, messageId: 'invalidConfiguration' })
        return
      }
      for (const { value } of configuration.value.members) {
        if (!isObjectNode(value)) {
          context.report({ loc: value.loc, messageId: 'invalidSetting' })
          continue
        }
        const type = findMember(value, 'type')
        if (type && !isValidType(type.value)) {
          context.report({ loc: type.value.loc, messageId: 'invalidType' })
        }
      }
    },
  }
}
