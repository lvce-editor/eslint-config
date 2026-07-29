import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-virtual-dom-prefer-layout-destructuring', async () => {
  const { expected, parsed } = await runFixture('sample-virtual-dom-prefer-layout-destructuring')
  expect(parsed).toEqual(expected)
})
