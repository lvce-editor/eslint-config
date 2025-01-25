import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-import-prefer-node-protocol', async () => {
  const { parsed, expected } = await runFixture('sample-import-prefer-node-protocol')
  expect(parsed).toEqual(expected)
})
