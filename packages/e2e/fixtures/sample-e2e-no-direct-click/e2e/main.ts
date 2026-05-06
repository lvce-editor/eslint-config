const agentModePickerToggle = {
  async click(): Promise<void> {},
}

export const selectAgentMode = async (): Promise<void> => {
  await agentModePickerToggle.click()
}
