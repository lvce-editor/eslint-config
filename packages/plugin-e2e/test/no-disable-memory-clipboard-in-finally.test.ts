import { RuleTester } from 'eslint'
import * as rule from '../src/rules/no-disable-memory-clipboard-in-finally.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-disable-memory-clipboard-in-finally', rule, {
  invalid: [
    {
      code: `
export const test = async ({ ClipBoard }) => {
  await ClipBoard.enableMemoryClipBoard()
  try {
    await ClipBoard.shouldHaveText('hello')
  } finally {
    await ClipBoard.disableMemoryClipBoard()
  }
}
`,
      errors: [{ messageId: 'noDisableMemoryClipBoardInFinally' }],
    },
    {
      code: `
export const test = async ({ ClipBoard }) => {
  try {
    await runTest()
  } finally {
    if (cleanup) {
      await ClipBoard.disableMemoryClipBoard()
    }
  }
}
`,
      errors: [{ messageId: 'noDisableMemoryClipBoardInFinally' }],
    },
  ],
  valid: [
    {
      code: `
export const test = async ({ ClipBoard }) => {
  await ClipBoard.enableMemoryClipBoard()
  await ClipBoard.shouldHaveText('hello')
}
`,
    },
    {
      code: `
export const test = async ({ ClipBoard }) => {
  await ClipBoard.disableMemoryClipBoard()
}
`,
    },
    {
      code: `
export const test = async ({ ClipBoard }) => {
  try {
    await runTest()
  } finally {
    await ClipBoard.clear()
  }
}
`,
    },
    {
      code: `
export const test = async ({ clipboard }) => {
  try {
    await runTest()
  } finally {
    await clipboard.disableMemoryClipBoard()
  }
}
`,
    },
  ],
})
