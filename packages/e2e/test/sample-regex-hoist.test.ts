import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-regex-hoist', async () => {
  const { parsed, expected } = await runFixture('sample-regex-hoist')
  expect(parsed).toEqual(expected)
})