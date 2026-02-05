import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-spellcheck', async () => {
  const { parsed, expected } = await runFixture('sample-spellcheck')
  expect(parsed).toEqual(expected)
})
