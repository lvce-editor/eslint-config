# @lvce-editor/eslint-config

> ESLint configuration for LVCE Editor

Explore the full LVCE Editor IDE at <https://lvce-editor.github.io/eslint-config/>.
The statically hosted editor runs directly in your browser without a development server.

## Quick-pick CSS linting

Projects that lint quick-pick stylesheets can add `recommendedQuickPickCss` to their
flat config. It enables CSS parsing and reports `contain: strict` on `.QuickPickItem`
selectors, where strict containment increased paint events in the LVCE quick-pick
benchmark. Other selectors can still use strict containment.

```js
import * as config from '@lvce-editor/eslint-config'

export default [...config.default, ...config.recommendedQuickPickCss]
```

## Dependency restrictions

The shared configuration and virtual DOM presets enable
`virtual-dom/no-restricted-dependencies` for `package.json`. It checks dependencies,
devDependencies, optionalDependencies, and peerDependencies. TypeScript must stay
within major version 6. ESLint is conservatively restricted to versions below
10.10.0 following the reported unsupported upgrade. Use an exact supported version
such as `10.8.1`, or an explicitly bounded range; `^10.8.1` permits the blocked upgrade.

The entire declared range must be supported. Tags, URLs, local paths, and npm aliases
are rejected for restricted packages because they do not establish a supported
version range. Other packages are unaffected. This checks manifests during linting;
it does not prevent npm installation or repair a toolchain that already fails to load.

Override or extend the defaults with `restrictions`. A range permits only versions
inside it; `false` bans a package entirely. For example, in a package.json config block:

```js
rules: {
  'virtual-dom/no-restricted-dependencies': ['error', {
    restrictions: {
      'some-package': false,
      'another-package': '^2.0.0',
    },
  }],
}
```

The recommended e2e configuration enables `e2e/require-awaited-opfs-cleanup`.
Create OPFS entries inside `try` and await matching `removeEntry` calls in `finally`;
use `{ recursive: true }` for directories. Nested entries may share their parent
directory's recursive cleanup. Writable streams also require an awaited `close()`
in `finally`, so failed writes and assertions still release test resources.
Acquisition immediately before the protecting `try` is supported. Conditional,
unawaited, deferred, mismatched, and unreachable cleanup is rejected.

```ts
const root = await navigator.storage.getDirectory()
try {
  const file = await root.getFileHandle('example.txt', { create: true })
  const writable = await file.createWritable()
  try {
    await writable.write('example')
  } finally {
    await writable.close()
  }
} finally {
  await root.removeEntry('example.txt')
}
```
