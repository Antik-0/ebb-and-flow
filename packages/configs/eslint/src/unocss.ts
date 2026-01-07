import type { Config } from 'eslint/config'
import Unocss from '@unocss/eslint-config/flat'
import { defineConfig } from 'eslint/config'

export default defineConfig({
  extends: [Unocss as unknown as Config],
  files: ['**/*.vue', '**/*.tsx'],
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
})
