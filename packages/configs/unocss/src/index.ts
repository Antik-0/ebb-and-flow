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
          DEFAULT: '#62d9e9',
          1: '#62d9e9',
          2: '#ff637e',
          3: '#a8b1ff'
        },
        border: '#3c3f44',
        divider: '#2e2e32'
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
