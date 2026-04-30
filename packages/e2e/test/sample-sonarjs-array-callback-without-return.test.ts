import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-sonarjs-array-callback-without-return', async () => {
  const { parsed, expected } = await runFixture('sample-sonarjs-array-callback-without-return')
  expect(parsed).toEqual(expected)
})
