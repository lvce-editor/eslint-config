import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-type-import-not-used', async () => {
  const { parsed, expected } = await runFixture('sample-type-import-not-used')
  expect(parsed).toEqual(expected)
})
