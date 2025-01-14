import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-prefer-destructuring', async () => {
  const { parsed, expected } = await runFixture('sample-prefer-destructuring')
  expect(parsed).toEqual(expected)
})
