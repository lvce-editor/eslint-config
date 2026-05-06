import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-e2e-no-direct-click', async () => {
  const { parsed, expected } = await runFixture('sample-e2e-no-direct-click')
  expect(parsed).toEqual(expected)
})