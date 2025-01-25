import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-tsconfig-no-side-effect-imports', async () => {
  const { parsed, expected } = await runFixture('sample-tsconfig-no-side-effect-imports')
  console.log({ parsed, expected })
  expect(parsed).toEqual(expected)
})
