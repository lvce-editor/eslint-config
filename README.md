# @lvce-editor/eslint-config

> ESLint configuration for LVCE Editor

### Dependency restrictions

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
