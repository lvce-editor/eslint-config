export const add = (items: number[]): number => {
  let total = 0
  for (const item of items) {
    total += item
  }
  return total
}
