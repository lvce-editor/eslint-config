import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-prefer-readonly-parameters', async () => {
  const { parsed, expected } = await runFixture('sample-prefer-readonly-parameters')
  expect(parsed).toEqual(expected)
})
