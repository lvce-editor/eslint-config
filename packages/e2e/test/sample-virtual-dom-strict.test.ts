import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-virtual-dom-strict', async () => {
  const { expected, parsed } = await runFixture('sample-virtual-dom-strict')
  expect(parsed).toEqual(expected)
})
