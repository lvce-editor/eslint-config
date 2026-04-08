import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-no-import-type-side-effects', async () => {
  const { parsed, expected } = await runFixture('sample-no-import-type-side-effects')
  expect(parsed).toEqual(expected)
})
