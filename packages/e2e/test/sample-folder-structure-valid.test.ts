import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-folder-structure-valid', async () => {
  const { expected, parsed } = await runFixture('sample-folder-structure-valid')
  expect(parsed).toEqual(expected)
})
