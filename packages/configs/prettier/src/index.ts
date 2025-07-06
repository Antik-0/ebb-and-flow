import type { Config } from 'prettier';

/**
 * reference: https://prettier.io/docs/en/options
 */
export function defineConfig() {
  return {
    printWidth: 80,
    semi: false,
    singleQuote: true,
    trailingComma: 'none',
    arrowParens: 'avoid'
  } as Config;
}
