interface Layout {
  readonly groups: readonly string[]
}

export const getFirstGroup = (layout: Layout): string | undefined => {
  return layout.groups[0]
}
