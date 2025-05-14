import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('invalid-ci-versions', async () => {
  const { parsed, expected } = await runFixture('invalid-ci-versions')
  expect(parsed).toEqual(expected)
})
