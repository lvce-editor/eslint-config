export default {
  meta: {
    type: 'problem' as const,

    docs: {
      description: 'Disallow not allowed keys in JSON objects',
    },

    messages: {
      noUncheckedSideEffectImport: 'noUncheckedSideEffectImport rule should be enabled',
    },
  },

  create(context: any) {
    return {
      Member(node: any) {
        if (node.name.type === 'String' && node.name.value === 'compilerOptions' && node.value.type === 'Object') {
          const members = node.value.members
          for (const member of members) {
            if (member.name.type === 'String' && member.name.value === 'noUncheckedSideEffectImports') {
              if (member.value.value === true) {
                return
              }
              if (member.value.value === false) {
                context.report({
                  loc: member.name.loc,
                  messageId: 'noUncheckedSideEffectImport',
                })
              }
              return
            }
          }
          context.report({
            loc: node.name.loc,
            messageId: 'noUncheckedSideEffectImport',
          })
        }
      },
    }
  },
}
