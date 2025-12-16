export const config = {
  ubuntu: ['ubuntu-24.04', 'ubuntu-24.04-arm'],
  macos: ['macos-15', 'macos-26'],
  windows: ['windows-2025', 'windows-11-arm'],
}

export const platforms = {
  windows: 'windows',
  ubuntu: 'ubuntu',
  macos: 'macos',
}

export const actions = {
  'actions/cache': ['actions/cache@v5'],
  'actions/checkout': ['actions/checkout@v6'],
  'actions/create-release': ['actions/create-release@v1'],
  'actions/deploy-pages': ['actions/deploy-pages@v4'],
  'actions/download-artifact': ['actions/download-artifact@v6'],
  'actions/setup-node': ['actions/setup-node@v6'],
  'actions/setup-python': ['actions/setup-python@v5'],
  'actions/upload-artifact': ['actions/upload-artifact@v6'],
  'actions/upload-pages-artifact': ['actions/upload-pages-artifact@v4'],
}

export const npmRegistries = ['https://registry.npmjs.org', 'https://npm.pkg.github.com']

export const onProperties = ['push', 'pull_request']

export const npmCommands = ['run', 'test', 'publish', 'install', 'ci']

export const shells = ['bash']

export const pythonVersions = ['3.13', '3.14', '3.15']

export const permissions: Record<string, readonly string[]> = {
  'id-token': ['write'],
  contents: ['write'],
  pages: ['write'],
}
