import { RuleTester } from 'eslint'
import * as rule from '../src/rules/hoist-static-nodes.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('hoist-static-nodes', rule, {
  invalid: [
    {
      code: `
import { ClassNames, VirtualDomElements } from './constants.js'

export const getSearchHeader = (message) => {
  return [
    {
      childCount: 2,
      className: ClassNames.SearchHeaderDetails,
      type: VirtualDomElements.Div,
    },
    getSearchMessage(message),
  ]
}
`,
      errors: [
        {
          column: 5,
          endColumn: 6,
          endLine: 10,
          line: 6,
          messageId: 'hoistStaticNode',
        },
      ],
    },
    {
      code: `
import { VirtualDomElements } from './constants.js'

const staticAttributes = {
  ariaHidden: true,
}

export function getSeparator() {
  return {
    aria: staticAttributes,
    childCount: 0,
    type: VirtualDomElements.Div,
  }
}
`,
      errors: [
        {
          messageId: 'hoistStaticNode',
        },
      ],
    },
  ],
  valid: [
    {
      code: `
export const getDialogOptions = () => {
  return {
    buttons: ['Ok', 'Cancel'],
    childCount: 0,
    type: 'info',
  }
}
`,
    },
    {
      code: `
import { ClassNames, VirtualDomElements } from './constants.js'

const searchHeader = {
  childCount: 2,
  className: ClassNames.SearchHeaderDetails,
  type: VirtualDomElements.Div,
}
`,
    },
    {
      code: `
import { VirtualDomElements } from './constants.js'

export const getMessage = (message) => {
  return {
    childCount: 0,
    text: message,
    type: VirtualDomElements.Div,
  }
}
`,
    },
    {
      code: `
import { VirtualDomElements } from './constants.js'

export const getLabelNode = () => {
  return {
    childCount: 0,
    label: getLabel(),
    type: VirtualDomElements.Div,
  }
}
`,
    },
    {
      code: `
import { VirtualDomElements } from './constants.js'

export const getNode = () => {
  const className = 'Button'
  return {
    childCount: 0,
    className,
    type: VirtualDomElements.Div,
  }
}
`,
    },
    {
      code: `
import { VirtualDomElements } from './constants.js'

let className = 'Button'

export const getNode = () => {
  return {
    childCount: 0,
    className,
    type: VirtualDomElements.Div,
  }
}
`,
    },
    {
      code: `
import { VirtualDomElements } from './constants.js'

export const getLabel = (parts) => {
  const label = {
    childCount: 0,
    type: VirtualDomElements.Div,
  }
  for (const part of parts) {
    label.childCount++
  }
  return label
}
`,
    },
    {
      code: `
import { VirtualDomElements } from './constants.js'

export const getLabel = (parts) => {
  const label = {
    childCount: 0,
    type: VirtualDomElements.Div,
  }
  label.childCount = parts.length
  return label
}
`,
    },
  ],
})
