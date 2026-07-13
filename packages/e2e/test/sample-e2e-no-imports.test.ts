import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-e2e-no-imports', async () => {
  const { expected, parsed } = await runFixture('sample-e2e-no-imports')
  expect(parsed).toEqual(expected)
})
