import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-e2e-no-inline-locator-in-expect', async () => {
  const { parsed, expected } = await runFixture('sample-e2e-no-inline-locator-in-expect')
  expect(parsed).toEqual(expected)
})
