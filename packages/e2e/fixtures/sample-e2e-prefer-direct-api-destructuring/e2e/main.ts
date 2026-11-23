type TestApi = {
  readonly DiffView: unknown
  readonly expect: (value: unknown) => { readonly toBeVisible: () => Promise<void> }
  readonly FileSystem: unknown
  readonly Locator: (selector: string) => unknown
}

type Test = (api: TestApi) => Promise<void>

export const test: Test = async (api) => {
  const locator = api.Locator('.View')
  await api.expect(locator).toBeVisible()
  Object.is(api.DiffView, api.FileSystem)
}
