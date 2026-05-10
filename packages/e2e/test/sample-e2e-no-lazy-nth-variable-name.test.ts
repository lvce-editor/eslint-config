import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-e2e-no-lazy-nth-variable-name', async () => {
  const { parsed, expected } = await runFixture('sample-e2e-no-lazy-nth-variable-name')
  expect(parsed).toEqual(expected)
})
