import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-should-use-using-mock-rpc', async () => {
  const { parsed, expected } = await runFixture('sample-should-use-using-mock-rpc')
  expect(parsed).toEqual(expected)
})
