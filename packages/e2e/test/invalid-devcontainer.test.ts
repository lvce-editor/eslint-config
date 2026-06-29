import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('invalid-devcontainer', async () => {
  const { expected, parsed } = await runFixture('invalid-devcontainer')
  expect(parsed).toEqual(expected)
})
