import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-too-many-exports', async () => {
  const { parsed, expected } = await runFixture('sample-too-many-exports')
  expect(parsed).toEqual(expected)
})
