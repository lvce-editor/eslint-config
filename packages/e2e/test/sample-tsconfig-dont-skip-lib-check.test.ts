import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-tsconfig-dont-skip-lib-check', async () => {
  const { expected, parsed } = await runFixture('sample-tsconfig-dont-skip-lib-check')
  expect(parsed).toEqual(expected)
})
