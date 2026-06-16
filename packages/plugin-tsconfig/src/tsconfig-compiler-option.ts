export const create = (context: any, name: string, shouldBeValue = true): { readonly Member: (node: any) => void } => {
  return {
    Member(node: any): void {
      if (node.name.type !== 'String' || node.name.value !== 'compilerOptions' || node.value.type !== 'Object') {
        return
      }
      const { members } = node.value
      for (const member of members) {
        if (member.name.type !== 'String' || member.name.value !== name) {
          continue
        }
        if (member.value.value === shouldBeValue) {
          return
        }
        if (member.value.value === !shouldBeValue) {
          context.report({
            loc: member.name.loc,
            messageId: name,
          })
        }
        return
      }
      context.report({
        loc: node.name.loc,
        messageId: name,
      })
    },
  }
}
