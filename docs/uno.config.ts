import { defineConfig, presetWind4, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true
      }
    })
  ],
  shortcuts: [
    ['flex-col', 'flex flex-col'],
    ['flex-center', 'flex items-center justify-center'],
    ['flex-col-center', 'flex-col items-center justify-center']
  ],
  content: {
    pipeline: {
      include: [/\.(vue|md)/]
    }
  },
  transformers: [transformerDirectives()]
})
