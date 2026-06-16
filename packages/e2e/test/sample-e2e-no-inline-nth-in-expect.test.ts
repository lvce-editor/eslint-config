import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-e2e-no-inline-nth-in-expect', async () => {
  const { expected, parsed } = await runFixture('sample-e2e-no-inline-nth-in-expect')
  expect(parsed).toEqual(expected)
})
