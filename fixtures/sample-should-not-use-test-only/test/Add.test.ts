import { test, expect } from '@jest/globals'
import * as Add from '../src/parts/Add/Add.ts'

test.only('add', () => {
  expect(Add.add(1, 2)).toBe(3)
})
