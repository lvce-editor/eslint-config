import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-should-use-return-type', async () => {
  const { parsed, expected } = await runFixture('sample-should-use-return-type')
  expect(parsed).toEqual(expected)
})
