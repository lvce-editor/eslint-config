import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

// eslint-disable-next-line jest/no-disabled-tests -- The fixture expectations are currently out of sync.
test.skip('invalid-devcontainer', async () => {
  const { expected, parsed } = await runFixture('invalid-devcontainer')
  expect(parsed).toEqual(expected)
})
