export const add = (items: readonly any[]): number => {
  let total = 0
  items.forEach((item) => {
    total += 1
  })
  return total
}
