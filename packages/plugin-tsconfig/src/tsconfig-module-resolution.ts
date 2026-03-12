import type { Rule } from 'eslint'

export const meta: Rule.RuleMetaData = {
  type: 'problem' as const,
  docs: {
    description: 'Validate moduleResolution values',
  },
  messages: {
    moduleResolution: 'moduleResolution must be set to bundle or nodenext',
  },
}

const allowedValues = new Set(['bundle', 'nodenext'])

export const create = (context: any) => {
  return {
    Member(node: any) {
      if (node.name.type !== 'String' || node.name.value !== 'compilerOptions' || node.value.type !== 'Object') {
        return
      }
      for (const member of node.value.members) {
        if (member.name.type !== 'String' || member.name.value !== 'moduleResolution') {
          continue
        }
        if (member.value.type !== 'String') {
          context.report({
            loc: member.name.loc,
            messageId: 'moduleResolution',
          })
          return
        }
        const value = member.value.value.toLowerCase()
        if (!allowedValues.has(value)) {
          context.report({
            loc: member.name.loc,
            messageId: 'moduleResolution',
          })
        }
        return
      }
    },
  }
}
