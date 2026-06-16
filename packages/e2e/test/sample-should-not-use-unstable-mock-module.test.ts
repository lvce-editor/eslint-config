import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-should-not-use-unstable-mock-module', async () => {
  const { expected, parsed } = await runFixture('sample-should-not-use-unstable-mock-module')
  expect(parsed).toEqual(expected)
})
