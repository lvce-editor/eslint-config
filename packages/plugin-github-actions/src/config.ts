export const config = {
  ubuntu: ['ubuntu-24.04'],
  macos: ['macos-15', 'macos-26'],
  windows: ['windows-2025'],
}

export const platforms = {
  windows: 'windows',
  ubuntu: 'ubuntu',
  macos: 'macos',
}

export const actions = {
  'actions/checkout': ['actions/checkout@v4'],
  'actions/setup-node': ['actions/setup-node@v6'],
  'actions/cache': ['actions/cache@v4'],
}
