import { RuleTester } from 'eslint'
import * as parser from '../src/parser.ts'
import * as rule from '../src/rules/valid-version.ts'

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
  },
})

ruleTester.run('valid-version', rule, {
  valid: [
    {
      code: '20.0.0',
    },
    {
      code: 'v24.15.0',
    },
    {
      code: '19.0.0',
      options: [
        {
          minimumVersion: '18.0.0',
        },
      ],
    },
    {
      code: '25.0.0',
      options: [
        {
          maximumVersion: '25.0.0',
        },
      ],
    },
    {
      code: '24.16.0',
      options: [
        {
          maximumVersion: '24.16.0',
          badVersions: [],
        },
      ],
    },
  ],
  invalid: [
    {
      code: '',
      errors: [
        {
          messageId: 'invalidVersion',
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: 'lts/*',
      errors: [
        {
          messageId: 'invalidVersion',
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: '20.01.0',
      errors: [
        {
          messageId: 'invalidVersion',
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: '19.9.0',
      errors: [
        {
          messageId: 'versionTooOld',
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: '24.16.1',
      errors: [
        {
          messageId: 'versionTooNew',
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: '24.16.0',
      errors: [
        {
          messageId: 'badVersion',
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: '22.1.0',
      options: [
        {
          badVersions: ['22.1.0'],
        },
      ],
      errors: [
        {
          messageId: 'badVersion',
          line: 1,
          column: 1,
        },
      ],
    },
  ],
})
