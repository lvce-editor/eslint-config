import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-type-import-not-used', async () => {
  const { expected, parsed } = await runFixture('sample-type-import-not-used')
  expect(parsed).toEqual(expected)
})
