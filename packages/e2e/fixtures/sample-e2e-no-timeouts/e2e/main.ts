export const wait = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
}
