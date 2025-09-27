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
        // 正文用 neutral
        // accent 用 gray
        // muted 用 zinc
        accent: '#6a6a71',
        muted: '#98989f',
        brand: {
          DEFAULT: '#5ac6d3',
          1: '#5ac6d3',
          2: '#a8b1ff',
          3: '#5c73e7'
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
})
