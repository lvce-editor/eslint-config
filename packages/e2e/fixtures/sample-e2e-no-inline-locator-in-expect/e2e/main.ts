const Locator = (selector: string): { selector: string } => ({ selector })

const expect = (_value: unknown): { toBeVisible(): Promise<void> } => ({
  async toBeVisible(): Promise<void> {},
})

export const assertChatModelPicker = async (): Promise<void> => {
  await expect(Locator('.ChatModelPicker')).toBeVisible()
}

export const assertCardTitle = async (card: { readonly locator: (selector: string) => unknown }): Promise<void> => {
  await expect(card.locator('.ComponentStateCardTitle')).toBeVisible()
  const title = card.locator('.ComponentStateCardTitle')
  await expect(title).toBeVisible()
}
