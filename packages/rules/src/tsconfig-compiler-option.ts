export const create = (context: any, name: string) => {
  return {
    Member(node: any) {
      if (node.name.type === 'String' && node.name.value === 'compilerOptions' && node.value.type === 'Object') {
        const members = node.value.members
        for (const member of members) {
          if (member.name.type === 'String' && member.name.value === name) {
            if (member.value.value === true) {
              return
            }
            if (member.value.value === false) {
              context.report({
                loc: member.name.loc,
                messageId: name,
              })
            }
            return
          }
        }
        context.report({
          loc: node.name.loc,
          messageId: name,
        })
      }
    },
  }
}
