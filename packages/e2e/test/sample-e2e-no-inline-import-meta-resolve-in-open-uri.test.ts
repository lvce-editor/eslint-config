import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-e2e-no-inline-import-meta-resolve-in-open-uri', async () => {
  const { expected, parsed } = await runFixture('sample-e2e-no-inline-import-meta-resolve-in-open-uri')
  expect(parsed).toEqual(expected)
})
