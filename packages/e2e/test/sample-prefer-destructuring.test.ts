import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-prefer-destructuring', async () => {
  const { expected, parsed } = await runFixture('sample-prefer-destructuring')
  expect(parsed).toEqual(expected)
})
