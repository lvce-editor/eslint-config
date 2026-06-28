import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-e2e-prefer-execute-extension-command', async () => {
  const { expected, parsed } = await runFixture('sample-e2e-prefer-execute-extension-command')
  expect(parsed).toEqual(expected)
})
