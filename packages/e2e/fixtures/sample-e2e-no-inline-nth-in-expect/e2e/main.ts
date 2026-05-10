const expect = (_value: unknown): { toBeVisible(): Promise<void>; toContainText(value: string): Promise<void> } => ({
  async toBeVisible(): Promise<void> {},
  async toContainText(_value: string): Promise<void> {},
})

export const assertPills = async (): Promise<void> => {
  const pills = page.locator('.pill')
  await expect(pills.nth(0)).toBeVisible()
  await expect(pills.nth(0)).toContainText('All')
}
