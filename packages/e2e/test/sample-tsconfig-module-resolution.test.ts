import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-tsconfig-module-resolution', async () => {
  const { parsed, expected } = await runFixture('sample-tsconfig-module-resolution')
  expect(parsed).toEqual(expected)
})
