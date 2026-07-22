import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

// eslint-disable-next-line jest/no-disabled-tests -- The fixture does not currently produce a result file.
test.skip('sample-folder-structure-invalid', async () => {
  const { expected, parsed } = await runFixture('sample-folder-structure-invalid')
  expect(parsed).toEqual(expected)
})
