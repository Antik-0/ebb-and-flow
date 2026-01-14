import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine-javascript.mjs'

const BundledLangs = [
  import('shiki/langs/html.mjs'),
  import('shiki/langs/css.mjs'),
  import('shiki/langs/javascript.mjs'),
  import('shiki/langs/typescript.mjs'),
  import('shiki/langs/json.mjs'),
  import('shiki/langs/tsx.mjs'),
  import('shiki/langs/vue.mjs'),
  import('shiki/langs/vb.mjs'),
  import('shiki/langs/shellscript.mjs')
]

const BundledThemes = [
  import('shiki/themes/github-light.mjs'),
  import('shiki/themes/github-dark.mjs'),
  import('shiki/themes/vitesse-light.mjs'),
  import('shiki/themes/vitesse-dark.mjs')
]

export const highlighterPromise = createHighlighterCore({
  langs: BundledLangs,
  themes: BundledThemes,
  engine: createJavaScriptRegexEngine()
})

export type Themes =
  | 'github-light'
  | 'github-dark'
  | 'vitesse-light'
  | 'vitesse-dark'
