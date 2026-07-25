import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Prefer toBeHidden over negated toBeVisible assertions',
  },
  fixable: 'code',
  messages: {
    preferToBeHidden: 'Use toBeHidden() instead of not.toBeVisible().',
  },
  type: 'suggestion',
}

const isIdentifier = (node: ESTree.Node, name: string): node is ESTree.Identifier => {
  return node.type === 'Identifier' && node.name === name
}

const isExpectCall = (node: ESTree.Expression | ESTree.Super): node is ESTree.SimpleCallExpression => {
  if (node.type !== 'CallExpression') {
    return false
  }
  const { callee } = node
  return isIdentifier(callee, 'expect') || (callee.type === 'MemberExpression' && !callee.computed && isIdentifier(callee.property, 'expect'))
}

const getNegatedToBeVisibleCallee = (
  node: ESTree.SimpleCallExpression,
): (ESTree.MemberExpression & { object: ESTree.MemberExpression }) | undefined => {
  const { callee } = node
  if (
    callee.type !== 'MemberExpression' ||
    callee.computed ||
    !isIdentifier(callee.property, 'toBeVisible') ||
    callee.object.type !== 'MemberExpression' ||
    callee.object.computed ||
    !isIdentifier(callee.object.property, 'not') ||
    !isExpectCall(callee.object.object)
  ) {
    return undefined
  }
  return callee as ESTree.MemberExpression & { object: ESTree.MemberExpression }
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  const { sourceCode } = context

  return {
    CallExpression(node: ESTree.SimpleCallExpression): void {
      const callee = getNegatedToBeVisibleCallee(node)
      if (!callee) {
        return
      }
      context.report({
        fix(fixer) {
          return fixer.replaceText(callee, `${sourceCode.getText(callee.object.object)}.toBeHidden`)
        },
        messageId: 'preferToBeHidden',
        node: callee,
      })
    },
  }
}
