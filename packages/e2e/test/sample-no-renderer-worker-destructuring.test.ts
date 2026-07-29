import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-no-renderer-worker-destructuring', async () => {
  const { expected, parsed } = await runFixture('sample-no-renderer-worker-destructuring')
  expect(parsed).toEqual(expected)
})
