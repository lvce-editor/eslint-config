export const addExtension = async (): Promise<string> => {
  const uri = new URL('../fixtures/sample', import.meta.url).toString()
  return uri
}
