const Main = {
  async openUri(_uri: string): Promise<void> {},
}

export const test = async (): Promise<void> => {
  await Main.openUri(import.meta.resolve('../sample-files/file.txt'))
}
