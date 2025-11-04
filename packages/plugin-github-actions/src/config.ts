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
  'actions/checkout': ['actions/checkout@v5'],
  'actions/setup-node': ['actions/setup-node@v6'],
  'actions/cache': ['actions/cache@v4'],
  'actions/upload-pages-artifact': ['actions/upload-pages-artifact@v4'],
  'actions/deploy-pages': ['actions/deploy-pages@v4'],
  'actions/download-artifact': ['actions/download-artifact@v4'],
  'actions/upload-artifact': ['actions/upload-artifact@v4'],
  'actions/create-release': ['actions/create-release@v1'],
}

export const npmRegistries = ['https://registry.npmjs.org', 'https://npm.pkg.github.com']

export const onProperties = ['push', 'pull_request']

export const npmCommands = ['run', 'test', 'publish', 'install', 'ci']

export const shells = ['bash']
