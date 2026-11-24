import type { Rule } from 'eslint'
import { findMember, isArrayNode, isObjectNode, isStringNode } from './ast.ts'

// cspell:ignore ctrlcmd downarrow leftarrow rightarrow uparrow
const identifierPattern = /^\w[\w-]*(?:\.\w[\w-]*)+$/

const keyNames = new Set([
  '`',
  ',',
  '-',
  '=',
  '*',
  '\\',
  'backquote',
  'backslash',
  'comma',
  'delete',
  'down',
  'downarrow',
  'end',
  'enter',
  'escape',
  'f1',
  'f2',
  'f3',
  'f4',
  'f5',
  'f6',
  'f7',
  'f8',
  'f9',
  'f10',
  'f11',
  'f12',
  'home',
  'insert',
  'left',
  'leftarrow',
  'minus',
  'pagedown',
  'pageup',
  'plus',
  'right',
  'rightarrow',
  'space',
  'tab',
  'up',
  'uparrow',
])

const modifierGroups = new Map([
  ['alt', 'alt'],
  ['cmd', 'ctrlCmd'],
  ['command', 'ctrlCmd'],
  ['ctrl', 'ctrlCmd'],
  ['ctrlcmd', 'ctrlCmd'],
  ['meta', 'ctrlCmd'],
  ['shift', 'shift'],
])

export const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Require valid keybinding contributions in extension manifests',
  },
  messages: {
    invalidCommand: 'extension keybinding command must be a dot-separated ASCII identifier',
    invalidKey: 'extension keybinding key is invalid',
    invalidKeybinding: 'extension keybinding must be an object with string key and command properties',
    invalidKeybindings: 'extension keybindings must be an array',
    invalidWhenExpression: 'extension keybinding when expression must be a dot-separated ASCII identifier',
  },
  type: 'problem' as const,
}

const isIdentifier = (value: string): boolean => {
  return identifierPattern.test(value)
}

const isKeyName = (value: string): boolean => {
  return /^[a-z0-9]$/i.test(value) || keyNames.has(value.toLowerCase())
}

const isValidKey = (value: string): boolean => {
  const parts = value.split('+').map((part) => part.trim())
  if (parts.length === 0 || parts.some((part) => !part)) {
    return false
  }
  const seenModifiers = new Set<string>()
  let keyCount = 0
  for (const part of parts) {
    const normalized = part.toLowerCase()
    const modifierGroup = modifierGroups.get(normalized)
    if (modifierGroup) {
      if (seenModifiers.has(modifierGroup)) {
        return false
      }
      seenModifiers.add(modifierGroup)
      continue
    }
    if (!isKeyName(part)) {
      return false
    }
    keyCount++
  }
  return keyCount === 1
}

const reportKeybinding = (context: Rule.RuleContext, keybinding: any): void => {
  if (!isObjectNode(keybinding)) {
    context.report({
      loc: keybinding.loc,
      messageId: 'invalidKeybinding',
    })
    return
  }
  const key = findMember(keybinding, 'key')
  const command = findMember(keybinding, 'command')
  if (!key || !command || !isStringNode(key.value) || !isStringNode(command.value)) {
    context.report({
      loc: keybinding.loc,
      messageId: 'invalidKeybinding',
    })
    return
  }
  if (!isValidKey(key.value.value)) {
    context.report({
      loc: key.name.loc,
      messageId: 'invalidKey',
    })
  }
  if (!isIdentifier(command.value.value)) {
    context.report({
      loc: command.name.loc,
      messageId: 'invalidCommand',
    })
  }
  const when = findMember(keybinding, 'when')
  if (when && (!isStringNode(when.value) || !isIdentifier(when.value.value))) {
    context.report({
      loc: when.name.loc,
      messageId: 'invalidWhenExpression',
    })
  }
}

export const create = (context: Rule.RuleContext): { readonly Document: (node: any) => void } => {
  return {
    Document(node: any): void {
      if (!isObjectNode(node.body)) {
        return
      }
      const keybindings = findMember(node.body, 'keybindings')
      if (!keybindings) {
        return
      }
      if (!isArrayNode(keybindings.value)) {
        context.report({
          loc: keybindings.name.loc,
          messageId: 'invalidKeybindings',
        })
        return
      }
      for (const element of keybindings.value.elements) {
        reportKeybinding(context, element.value)
      }
    },
  }
}
