import type { Rule } from 'eslint'
import type * as ESTree from 'estree'

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow clicking context menu item locators directly in E2E tests',
  },
  messages: {
    noMenuItemClick: 'Do not call .click() on a .MenuItem locator. Use ContextMenu.selectItem(...) instead.',
  },
  type: 'problem',
}

const isMenuItemLocatorCall = (node: ESTree.Expression): boolean => {
  if (node.type !== 'CallExpression') {
    return false
  }
  if (node.callee.type === 'Identifier' && node.callee.name === 'Locator') {
    const [selector] = node.arguments
    return selector?.type === 'Literal' && selector.value === '.MenuItem'
  }
  return node.callee.type === 'MemberExpression' && node.callee.object.type !== 'Super' && isMenuItemLocatorCall(node.callee.object)
}

const isClickCall = (node: ESTree.SimpleCallExpression): node is ESTree.SimpleCallExpression & { callee: ESTree.MemberExpression } => {
  return node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier' && node.callee.property.name === 'click'
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  const menuItemLocators = new Set<string>()

  return {
    CallExpression(node: ESTree.SimpleCallExpression): void {
      if (!isClickCall(node) || node.callee.object.type === 'Super') {
        return
      }
      const locator = node.callee.object
      if ((locator.type === 'Identifier' && menuItemLocators.has(locator.name)) || isMenuItemLocatorCall(locator)) {
        context.report({
          messageId: 'noMenuItemClick',
          node: node.callee.property,
        })
      }
    },
    VariableDeclarator(node: ESTree.VariableDeclarator): void {
      if (node.id.type === 'Identifier' && node.init && isMenuItemLocatorCall(node.init)) {
        menuItemLocators.add(node.id.name)
      }
    },
  }
}
