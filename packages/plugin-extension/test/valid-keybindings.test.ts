import json from '@eslint/json'
import { RuleTester } from 'eslint'
import * as rule from '../src/rules/valid-keybindings.ts'

// cspell:ignore föcus
const ruleTester = new RuleTester({
  language: 'json/json',
  plugins: {
    // @ts-ignore
    json,
  },
})

ruleTester.run('valid-keybindings', rule, {
  invalid: [
    {
      code: '{"keybindings": {}}',
      errors: [{ messageId: 'invalidKeybindings' }],
    },
    {
      code: '{"keybindings": [null]}',
      errors: [{ messageId: 'invalidKeybinding' }],
    },
    {
      code: '{"keybindings": [{}]}',
      errors: [{ messageId: 'invalidKeybinding' }],
    },
    {
      code: '{"keybindings": [{"key": 1, "command": "sample.run"}]}',
      errors: [{ messageId: 'invalidKeybinding' }],
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+N", "command": 1}]}',
      errors: [{ messageId: 'invalidKeybinding' }],
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+Nope", "command": "sample.run"}]}',
      errors: [{ messageId: 'invalidKey' }],
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+Shift", "command": "sample.run"}]}',
      errors: [{ messageId: 'invalidKey' }],
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+A+B", "command": "sample.run"}]}',
      errors: [{ messageId: 'invalidKey' }],
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+Ctrl+A", "command": "sample.run"}]}',
      errors: [{ messageId: 'invalidKey' }],
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+N", "command": "sample"}]}',
      errors: [{ messageId: 'invalidCommand' }],
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+N", "command": ".sample"}]}',
      errors: [{ messageId: 'invalidCommand' }],
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+N", "command": "sample.rün"}]}',
      errors: [{ messageId: 'invalidCommand' }],
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+N", "command": "sample.run", "when": 1}]}',
      errors: [{ messageId: 'invalidWhenExpression' }],
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+N", "command": "sample.run", "when": "sample"}]}',
      errors: [{ messageId: 'invalidWhenExpression' }],
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+N", "command": "sample.run", "when": "sample.föcus"}]}',
      errors: [{ messageId: 'invalidWhenExpression' }],
    },
    {
      code: '{"keybindings": [{"key": "Nope", "command": "invalid", "when": "also-invalid"}]}',
      errors: [{ messageId: 'invalidKey' }, { messageId: 'invalidCommand' }, { messageId: 'invalidWhenExpression' }],
    },
  ],
  valid: [
    {
      code: '{}',
    },
    {
      code: '{"keybindings": []}',
    },
    {
      code: '{"keybindings": [{"key": "Ctrl+N", "command": "codex.newSession", "when": "codex.sessionsFocus"}]}',
    },
    {
      code: '{"keybindings": [{"key": "Alt + Left", "command": "lvce-updates.refresh", "when": "lvce-updates.dashboardFocus"}]}',
    },
    {
      code: '{"keybindings": [{"key": "Escape", "command": "codex.show"}]}',
    },
    {
      code: '{"keybindings": [{"key": "CtrlCmd+Shift+R", "command": "sample.run_action", "when": "sample.editor_focus"}]}',
    },
    {
      code: '{"keybindings": [{"key": "F12", "command": "sample.run"}, {"key": "*", "command": "sample.star"}, {"key": "\\\\", "command": "sample.backslash"}]}',
    },
  ],
})
