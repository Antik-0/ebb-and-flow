import type { Theme } from '@unocss/preset-wind4'
import presetWind4 from '@unocss/preset-wind4'
import {
  definePreset,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

interface EbbTheme extends Theme {}

export const ebbUnoPreset = definePreset<undefined, EbbTheme>(() => {
  return {
    name: '@unocss/preset-ebb',
    presets: [
      presetWind4({
        preflights: { reset: true }
      })
    ] as any,
    theme: {
      colors: {
        // 主题色
        brand: {
          DEFAULT: 'var(--c-brand-1)',
          1: 'var(--c-brand-1)',
          2: 'var(--c-brand-2)',
          3: 'var(--c-brand-3)'
        },
        // 基础
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // 静音：用于文本或图标等信息的静默态
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        // 强调：用于文本或图标等信息的 hover 态
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        // 边框
        border: 'var(--c-border)',
        divider: 'var(--c-divider)'
      }
    },
    shortcuts: [
      ['flex-col', 'flex flex-col'],
      ['flex-center', 'items-center justify-center']
    ],
    rules: [['grid-full', { 'grid-area': '1 / 1' }]],
    content: {
      pipeline: {
        include: [/\.(vue|tsx|mdx?)/]
      }
    },
    transformers: [transformerDirectives(), transformerVariantGroup()]
  }
})
