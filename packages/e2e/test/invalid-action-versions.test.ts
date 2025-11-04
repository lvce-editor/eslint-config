import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('invalid-action-versions', async () => {
  const { parsed, expected } = await runFixture('invalid-action-versions')
  expect(parsed).toEqual(expected)
})
