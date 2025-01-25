import type { B } from './b.ts'
import type { A } from './a.ts'

interface C extends A, B {}

export const config: C = {
  a: 1,
  b: 1,
}
