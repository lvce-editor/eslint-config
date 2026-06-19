import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-virtual-dom-rules', async () => {
  const { expected, parsed } = await runFixture('sample-virtual-dom-rules')
  expect(parsed).toEqual(expected)
})
