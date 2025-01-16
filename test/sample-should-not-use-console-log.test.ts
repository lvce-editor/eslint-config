import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-should-not-use-console-log', async () => {
  const { parsed, expected } = await runFixture('sample-should-not-use-console-log')
  expect(parsed).toEqual(expected)
})
