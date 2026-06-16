import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-should-not-use-reflect-or-proxy', async () => {
  const { expected, parsed } = await runFixture('sample-should-not-use-reflect-or-proxy')
  expect(parsed).toEqual(expected)
})
