import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-tsconfig-no-side-effect-imports', async () => {
  const { expected, parsed } = await runFixture('sample-tsconfig-no-side-effect-imports')
  expect(parsed).toEqual(expected)
})
