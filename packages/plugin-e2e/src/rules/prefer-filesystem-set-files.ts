import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer FileSystem.setFiles over adjacent FileSystem.writeFile calls',
  },
  messages: {
    preferFileSystemSetFiles:
      'Use FileSystem.setFiles([...fileItems]) instead of multiple adjacent FileSystem.writeFile calls so files can be written in parallel.',
  },
  type: 'suggestion',
}

const isFileSystemWriteFileCall = (node: ESTree.Node): boolean => {
  if (node.type !== 'CallExpression') {
    return false
  }
  const { callee } = node
  return (
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'FileSystem' &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'writeFile'
  )
}

const isAwaitedFileSystemWriteFile = (node: ESTree.Node): boolean => {
  return node.type === 'ExpressionStatement' && node.expression.type === 'AwaitExpression' && isFileSystemWriteFileCall(node.expression.argument)
}

const reportAdjacentFileSystemWriteFiles = (context: Rule.RuleContext, statements: readonly ESTree.Statement[]): void => {
  let previousStatementWasWriteFile = false
  for (const statement of statements) {
    const isWriteFile = isAwaitedFileSystemWriteFile(statement)
    if (isWriteFile && previousStatementWasWriteFile) {
      context.report({
        messageId: 'preferFileSystemSetFiles',
        node: statement,
      })
    }
    previousStatementWasWriteFile = isWriteFile
  }
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  return {
    BlockStatement(node: ESTree.BlockStatement): void {
      reportAdjacentFileSystemWriteFiles(context, node.body)
    },
  }
}
