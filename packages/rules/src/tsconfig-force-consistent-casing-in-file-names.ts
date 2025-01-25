export const meta = {
  type: 'problem' as const,
  docs: {
    description: 'Ensure that the forceConsistentCasingInFileNames rule is enabled',
  },
  messages: {
    forceConsistentCasingInFileNames: 'forceConsistentCasingInFileNames rule should be enabled',
  },
}

export const create = (context: any) => {
  return {
    Member(node: any) {
      if (node.name.type === 'String' && node.name.value === 'compilerOptions' && node.value.type === 'Object') {
        const members = node.value.members
        for (const member of members) {
          if (member.name.type === 'String' && member.name.value === 'forceConsistentCasingInFileNames') {
            if (member.value.value === true) {
              return
            }
            if (member.value.value === false) {
              context.report({
                loc: member.name.loc,
                messageId: 'forceConsistentCasingInFileNames',
              })
            }
            return
          }
        }
        context.report({
          loc: node.name.loc,
          messageId: 'forceConsistentCasingInFileNames',
        })
      }
    },
  }
}
