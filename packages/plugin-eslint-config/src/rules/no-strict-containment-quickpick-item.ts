import type { Rule } from 'eslint'

const containsQuickPickItem = (node: any): boolean => {
  if (!node) {
    return false
  }
  if (node.type === 'ClassSelector' && node.name === 'QuickPickItem') {
    return true
  }
  let found = false
  const children = node.children ?? []
  for (const child of children) {
    found ||= containsQuickPickItem(child)
  }
  return found
}

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Disallow strict containment on quick-pick result rows',
  },
  messages: {
    avoidStrictContainment:
      'Avoid contain: strict on .QuickPickItem rows; it increases quick-pick paint events. Use size/style containment when appropriate.',
  },
  type: 'problem',
}

export const create = (context: Rule.RuleContext): Rule.RuleListener => {
  const sourceCode = context.sourceCode as any
  return {
    Rule(cssRule: any): void {
      if (cssRule.type !== 'Rule' || !cssRule.prelude?.children || !cssRule.block?.children) {
        return
      }
      let appliesToQuickPickItem = false
      for (const selector of cssRule.prelude.children) {
        appliesToQuickPickItem ||= containsQuickPickItem(selector)
      }
      if (!appliesToQuickPickItem) {
        return
      }
      for (const declaration of cssRule.block.children) {
        if (declaration.type !== 'Declaration' || declaration.property.toLowerCase() !== 'contain') {
          return
        }
        const value = sourceCode
          .getText(declaration.value)
          .replaceAll(/\/\*[\s\S]*?\*\//gu, '')
          .trim()
        if (/^strict$/iu.test(value)) {
          context.report({
            messageId: 'avoidStrictContainment',
            node: declaration,
          })
        }
      }
    },
  }
}
