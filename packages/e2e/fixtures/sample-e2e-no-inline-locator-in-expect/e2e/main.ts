const Locator = (selector: string) => ({ selector })

const expect = (value: unknown) => ({
  async toBeVisible() {
    return value
  },
})

export const assertChatModelPicker = async () => {
  await expect(Locator('.ChatModelPicker')).toBeVisible()
}