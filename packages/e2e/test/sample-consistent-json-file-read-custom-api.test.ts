import { expect, test } from '@jest/globals'
import { runFixture } from './util.ts'

test('sample-consistent-json-file-read-custom-api', async () => {
  const { expected, parsed } = await runFixture('sample-consistent-json-file-read-custom-api')
  expect(parsed).toEqual(expected)
})
