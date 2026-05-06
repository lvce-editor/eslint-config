const Locator = (selector: string): { selector: string } => ({ selector })

const expect = (_value: unknown): { toBeVisible(): Promise<void> } => ({
  async toBeVisible(): Promise<void> {
  },
})

export const assertChatModelPicker = async (): Promise<void> => {
  await expect(Locator('.ChatModelPicker')).toBeVisible()
}
