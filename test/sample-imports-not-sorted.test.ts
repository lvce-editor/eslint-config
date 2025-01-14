import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-imports-not-sorted', async () => {
  const { parsed, expected } = await runFixture('sample-imports-not-sorted')
  expect(parsed).toEqual(expected)
})
