import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('invalid-ci-versions', async () => {
  const { expected, parsed } = await runFixture('invalid-ci-versions')
  expect(parsed).toEqual(expected)
})
