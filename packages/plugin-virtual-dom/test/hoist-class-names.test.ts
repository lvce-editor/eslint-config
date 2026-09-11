import { RuleTester } from 'eslint'
import * as rule from '../src/rules/hoist-class-names.ts'

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })
const imports = `import { mergeClassNames } from '@lvce-editor/virtual-dom-worker';
import * as ClassNames from './ClassNames.ts';`

ruleTester.run('hoist-class-names', rule, {
  invalid: [
    `${imports} function render(value) { return { className: mergeClassNames(ClassNames.Button, ClassNames.Disabled), value } }`,
    `${imports} const render = () => mergeClassNames('Button', 'Disabled')`,
    `${imports} const base = 'Button'; const alias = base; const render = function () { return mergeClassNames(alias, 'Disabled') }`,
    `import { mergeClassNames as merge } from '@lvce-editor/virtual-dom-worker'; const render = () => merge('Button', 'Disabled')`,
    `import * as MergeClassNames from './MergeClassNames.ts'; const render = () => MergeClassNames.mergeClassNames('Button', 'Disabled')`,
    `${imports} const render = () => mergeClassNames('But' + 'ton', \`Disabled\`)`,
    `${imports} const render = () => () => mergeClassNames(ClassNames.Button, ClassNames.Disabled)`,
  ].map((code) => ({ code, errors: [{ messageId: 'hoistClassNames' }] })),
  valid: [
    `${imports} const className = mergeClassNames(ClassNames.Button, ClassNames.Disabled)`,
    `${imports} const render = (value) => mergeClassNames(ClassNames.Button, value)`,
    `${imports} const render = (disabled) => mergeClassNames(ClassNames.Button, disabled ? ClassNames.Disabled : '')`,
    `${imports} const render = () => { const local = 'Button'; return mergeClassNames(local, ClassNames.Disabled) }`,
    `${imports} let base = 'Button'; const render = () => mergeClassNames(base, ClassNames.Disabled)`,
    `${imports} const base = getBase(); const render = () => mergeClassNames(base, ClassNames.Disabled)`,
    `${imports} const obj = { base: 'Button' }; const render = () => mergeClassNames(obj.base, ClassNames.Disabled)`,
    `${imports} const render = (mergeClassNames) => mergeClassNames('Button', 'Disabled')`,
    `${imports} const render = (ClassNames) => mergeClassNames(ClassNames.Button, ClassNames.Disabled)`,
    `const mergeClassNames = (...values) => values.join(' '); const render = () => mergeClassNames('Button', 'Disabled')`,
    `${imports} const render = () => mergeClassNames(...classes)`,
    `${imports} const render = () => mergeClassNames(ClassNames[getKey()], 'Disabled')`,
    `${imports} const a = b; const b = a; const render = () => mergeClassNames(a, 'Disabled')`,
    `${imports} const render = () => mergeClassNames?.('Button', 'Disabled')`,
  ],
})
