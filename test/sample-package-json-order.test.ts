import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test.skip('sample-package-json-order', async () => {
  const { parsed, expected } = await runFixture('sample-package-json-order')
  expect(parsed).toEqual(expected)
})
