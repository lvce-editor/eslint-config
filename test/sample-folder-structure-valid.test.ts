import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-folder-structure-valid', async () => {
  const { parsed, expected } = await runFixture('sample-folder-structure-valid')
  expect(parsed).toEqual(expected)
})
