import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow exporting skip with a value of zero',
  },
  fixable: 'code',
  messages: {
    noSkipZero: 'Omit the skip export when the test should run.',
  },
  type: 'suggestion',
}

const isSkipZeroDeclaration = (node: ESTree.ExportNamedDeclaration): boolean => {
  const { declaration } = node
  if (declaration?.type !== 'VariableDeclaration' || declaration.kind !== 'const' || declaration.declarations.length !== 1) {
    return false
  }
  const [{ id, init }] = declaration.declarations
  return id.type === 'Identifier' && id.name === 'skip' && init?.type === 'Literal' && init.value === 0
}

const getRemovalRange = (node: ESTree.ExportNamedDeclaration, sourceCode: Rule.RuleContext['sourceCode']): [number, number] | undefined => {
  if (!node.range) {
    return undefined
  }
  const trailingLineBreaks = /^(?:[\t ]*\r?\n)+/.exec(sourceCode.text.slice(node.range[1]))?.[0].length ?? 0
  return [node.range[0], node.range[1] + trailingLineBreaks]
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  const { sourceCode } = context

  return {
    ExportNamedDeclaration(node: ESTree.ExportNamedDeclaration): void {
      if (!isSkipZeroDeclaration(node)) {
        return
      }
      context.report({
        fix(fixer) {
          const range = getRemovalRange(node, sourceCode)
          return range ? fixer.removeRange(range) : fixer.remove(node)
        },
        messageId: 'noSkipZero',
        node,
      })
    },
  }
}
