import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('invalid-nvmrc-version', async () => {
  const { parsed, expected } = await runFixture('invalid-nvmrc-version')
  expect(parsed).toEqual(expected)
})
