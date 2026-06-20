type TestApi = {
  readonly DiffView: unknown
  readonly expect: (value: unknown) => { readonly toBeVisible: () => Promise<void> }
  readonly FileSystem: unknown
  readonly Locator: (selector: string) => unknown
}

type Test = (api: TestApi) => Promise<void>

export const test: Test = async (api) => {
  const { DiffView, expect, FileSystem, Locator } = api
  const locator = Locator('.View')
  await expect(locator).toBeVisible()
  Object.is(DiffView, FileSystem)
}
