import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-should-not-use-test-only', async () => {
  const { parsed, expected } = await runFixture('sample-should-not-use-test-only')
  expect(parsed).toEqual(expected)
})
