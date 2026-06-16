import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test.skip('sample-too-many-exports', async () => {
  const { expected, parsed } = await runFixture('sample-too-many-exports')
  expect(parsed).toEqual(expected)
})
