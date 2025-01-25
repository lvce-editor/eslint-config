import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-should-use-for-of', async () => {
  const { parsed, expected } = await runFixture('sample-should-use-for-of')
  expect(parsed).toEqual(expected)
})
