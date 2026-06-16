import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test.skip('sample-folder-structure-invalid', async () => {
  const { expected, parsed } = await runFixture('sample-folder-structure-invalid')
  expect(parsed).toEqual(expected)
})
