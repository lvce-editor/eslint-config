import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-no-reflect', async () => {
  const { parsed, expected } = await runFixture('sample-no-reflect')
  expect(parsed).toEqual(expected)
})
