import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer Command.executeExtensionCommand over Command.execute for extension commands',
  },
  fixable: 'code',
  messages: {
    preferExecuteExtensionCommand: "Use Command.executeExtensionCommand(...) instead of Command.execute('ExtensionHost.executeCommand', ...).",
  },
  type: 'suggestion',
}

const isIdentifier = (node: ESTree.Node, name: string): node is ESTree.Identifier => {
  return node.type === 'Identifier' && node.name === name
}

const isExtensionHostExecuteCommand = (node: ESTree.Node | ESTree.SpreadElement): boolean => {
  return node.type === 'Literal' && node.value === 'ExtensionHost.executeCommand'
}

const isCommandExecuteCall = (node: ESTree.SimpleCallExpression): node is ESTree.SimpleCallExpression & { callee: ESTree.MemberExpression } => {
  return (
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    isIdentifier(node.callee.object, 'Command') &&
    isIdentifier(node.callee.property, 'execute')
  )
}

const isExtensionCommandCall = (node: ESTree.SimpleCallExpression): node is ESTree.SimpleCallExpression & { callee: ESTree.MemberExpression } => {
  return isCommandExecuteCall(node) && node.arguments.length >= 2 && isExtensionHostExecuteCommand(node.arguments[0])
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  const { sourceCode } = context

  return {
    CallExpression(node: ESTree.SimpleCallExpression): void {
      if (!isExtensionCommandCall(node)) {
        return
      }
      context.report({
        fix(fixer) {
          const args = node.arguments.slice(1).map((argument) => sourceCode.getText(argument))
          return fixer.replaceText(node, `Command.executeExtensionCommand(${args.join(', ')})`)
        },
        messageId: 'preferExecuteExtensionCommand',
        node,
      })
    },
  }
}
