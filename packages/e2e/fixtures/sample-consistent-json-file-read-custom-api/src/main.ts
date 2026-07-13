const fileSystemWorker = {
  readFile: async (_path: string): Promise<string> => '{"value":true}',
}

export const loadConfig = async (): Promise<unknown> => {
  const content = await fileSystemWorker.readFile('config.json')
  return JSON.parse(content)
}
