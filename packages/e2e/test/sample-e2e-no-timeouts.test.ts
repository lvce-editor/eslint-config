import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-e2e-no-timeouts', async () => {
  const { expected, parsed } = await runFixture('sample-e2e-no-timeouts')
  expect(parsed).toEqual(expected)
})
