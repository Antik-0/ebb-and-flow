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
