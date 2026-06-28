export const applyStash = async (): Promise<void> => {
  await Command.execute('ExtensionHost.executeCommand', 'git.applyStash')
}

export const loadFixture = async (fixtureUrl: string): Promise<void> => {
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
}
