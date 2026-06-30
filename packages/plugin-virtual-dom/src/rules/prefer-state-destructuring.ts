import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer destructuring state properties before use',
  },
  messages: {
    preferStateDestructuring: 'Prefer destructuring from state instead of using state.{{property}}.',
  },
  type: 'suggestion',
}

interface NodeWithParent extends ESTree.BaseNode {
  parent?: ESTree.Node
}

const isIdentifier = (node: ESTree.Node | null): node is ESTree.Identifier => {
  return node?.type === 'Identifier'
}

const isWriteExpression = (node: ESTree.MemberExpression): boolean => {
  const { parent } = node as NodeWithParent
  if (!parent) {
    return false
  }
  if (parent.type === 'AssignmentExpression' && parent.left === node) {
    return true
  }
  if (parent.type === 'UpdateExpression' && parent.argument === node) {
    return true
  }
  return parent.type === 'UnaryExpression' && parent.operator === 'delete' && parent.argument === node
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    MemberExpression(node: ESTree.MemberExpression): void {
      if (node.computed) {
        return
      }
      if (!isIdentifier(node.object) || node.object.name !== 'state') {
        return
      }
      if (!isIdentifier(node.property)) {
        return
      }
      if (isWriteExpression(node)) {
        return
      }
      context.report({
        data: {
          property: node.property.name,
        },
        messageId: 'preferStateDestructuring',
        node,
      })
    },
  }
}
