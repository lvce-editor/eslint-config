import { test, expect, jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Add/Add.ts', () => {
  return {
    add(): number {
      return 3
    },
  }
})

const Add = await import('../src/parts/Add/Add.ts')

test('add', () => {
  expect(Add.add(1, 2)).toBe(3)
})
