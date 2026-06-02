import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-e2e-prefer-import-meta-resolve', async () => {
  const { parsed, expected } = await runFixture('sample-e2e-prefer-import-meta-resolve')
  expect(parsed).toEqual(expected)
})
