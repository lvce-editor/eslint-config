import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

// eslint-disable-next-line jest/no-disabled-tests -- The fixture does not currently produce a result file.
test.skip('sample-too-many-exports', async () => {
  const { expected, parsed } = await runFixture('sample-too-many-exports')
  expect(parsed).toEqual(expected)
})
