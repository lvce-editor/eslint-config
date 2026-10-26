import { Linter } from 'eslint'
import assert from 'node:assert/strict'
import { recommendedQuickPickCss } from '../src/index.ts'

const linter = new Linter()

const simpleMessages = linter.verify('.QuickPickItem { contain: strict; }', recommendedQuickPickCss, { filename: 'test.css' })
assert.equal(simpleMessages.length, 1)
assert.equal(simpleMessages[0]?.messageId, 'avoidStrictContainment')
assert.equal(simpleMessages[0].line, 1)

const groupedMessages = linter.verify(
  '.other, /* quick pick row */ .QuickPickItem:where(:hover) { contain: /* avoid */ strict !important; }',
  recommendedQuickPickCss,
  { filename: 'test.css' },
)
assert.equal(groupedMessages.length, 1)
assert.equal(groupedMessages[0]?.messageId, 'avoidStrictContainment')

const allowedMessages = linter.verify(
  `
.QuickPickItem { contain: size style; }
.QuickPickMaskIcon { contain: strict; }
`,
  recommendedQuickPickCss,
  { filename: 'test.css' },
)
assert.deepEqual(allowedMessages, [])
