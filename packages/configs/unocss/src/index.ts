import type { PresetFactory } from 'unocss'
import {
  definePreset,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export const presetBase = definePreset(() => {
  return {
    name: 'base',
    presets: [
      presetWind4({
        preflights: {
          reset: true
        }
      })
    ],
    theme: {
      colors: {
        brand: {
          DEFAULT: 'var(--c-brand-1)',
          1: 'var(--c-brand-1)',
          2: 'var(--c-brand-2)',
          3: 'var(--c-brand-3)'
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        border: 'var(--c-border)',
        divider: 'var(--c-divider)'
      }
    },
    shortcuts: [
      ['flex-col', 'flex flex-col'],
      ['flex-center', 'items-center justify-center']
    ],
    content: {
      pipeline: {
        include: [/\.(vue|md)/]
      }
    },
    transformers: [transformerDirectives(), transformerVariantGroup()]
  }
}) as PresetFactory<any>
