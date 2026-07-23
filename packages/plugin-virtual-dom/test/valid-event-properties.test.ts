import { RuleTester } from 'eslint'
import * as rule from '../src/rules/valid-event-properties.ts'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

ruleTester.run('valid-event-properties', rule, {
  invalid: [
    {
      code: `const node = { childCount: 0, onContextmenu: Events.ContextMenu, type: Elements.Div }`,
      errors: [{ messageId: 'validEventProperty' }],
    },
  ],
  valid: [
    `const node = { childCount: 0, onContextMenu: Events.ContextMenu, type: Elements.Div }`,
    `const value = { onContextmenu: 1, type: MessageType.Info }`,
  ],
})
