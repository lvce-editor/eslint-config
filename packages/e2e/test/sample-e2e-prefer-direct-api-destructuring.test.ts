import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-e2e-prefer-direct-api-destructuring', async () => {
  const { expected, parsed } = await runFixture('sample-e2e-prefer-direct-api-destructuring')
  expect(parsed).toEqual(expected)
})
