const expect = (_value: unknown): { toBeVisible(): Promise<void> } => ({
  async toBeVisible(): Promise<void> {},
})

export const assertRows = async (): Promise<void> => {
  const row0 = rows.nth(0)
  await expect(row0).toBeVisible()
  const rowsNth0 = rows.nth(0)
  await expect(rowsNth0).toBeVisible()
}
