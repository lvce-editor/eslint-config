import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('invalid-pull-request-target', async () => {
  const { expected, parsed } = await runFixture('invalid-pull-request-target')
  expect(parsed).toEqual(expected)
})
