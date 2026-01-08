import parserTs from '@typescript-eslint/parser'
import UnoPlugin from '@unocss/eslint-plugin'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.vue'],
    plugins: {
      ...(UnoPlugin.configs.flat.plugins as any)
    },
    rules: {
      'unocss/order': [
        'warn',
        {
          unoFunctions: ['clsx'],
          unoVariables: []
        }
      ],
      'unocss/order-attributify': 'warn'
    }
  },
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      ...(UnoPlugin.configs.flat.plugins as any)
    },
    rules: {
      'unocss/order': [
        'warn',
        {
          unoFunctions: ['clsx'],
          unoVariables: []
        }
      ],
      'unocss/order-attributify': 'warn'
    }
  }
])
