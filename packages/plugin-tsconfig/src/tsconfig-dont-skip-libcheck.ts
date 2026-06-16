import type { Rule } from 'eslint'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Enforce not skipping libCheck',
  },
  messages: {
    skipLibCheck: "Don't skip libcheck",
  },
  type: 'problem' as const,
}

export const create = (context: any) => {
  return {
    Member(node: any) {
      if (node.name.type === 'String' && node.name.value === 'compilerOptions' && node.value.type === 'Object') {
        const { members } = node.value
        for (const member of members) {
          if (member.name.type === 'String' && member.name.value === 'skipLibCheck') {
            if (member.value.value === true) {
              context.report({
                loc: member.name.loc,
                messageId: 'skipLibCheck',
              })
            }
            return
          }
        }
        // Allow omitting skipLibCheck
        return
      }
    },
  }
}
