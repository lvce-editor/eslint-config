export const isArrayNode = (node: any): boolean => {
  return node && node.type === 'Array'
}

export const isObjectNode = (node: any): boolean => {
  return node && node.type === 'Object'
}

export const isStringNode = (node: any): boolean => {
  return node && node.type === 'String'
}

const getMemberName = (member: any): string | undefined => {
  if (member.name.type === 'String') {
    return member.name.value
  }
  if (member.name.type === 'Identifier') {
    return member.name.name
  }
  return undefined
}

export const findMember = (node: any, name: string): any => {
  if (!isObjectNode(node)) {
    return undefined
  }
  for (const member of node.members) {
    if (getMemberName(member) === name) {
      return member
    }
  }
  return undefined
}
