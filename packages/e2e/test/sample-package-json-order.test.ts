import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

// eslint-disable-next-line jest/no-disabled-tests -- The fixture expectations are currently out of sync.
test.skip('sample-package-json-order', async () => {
  const { expected, parsed } = await runFixture('sample-package-json-order')
  expect(parsed).toEqual(expected)
})
