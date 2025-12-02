import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  alias: {
    '@': fileURLToPath(new URL('./app/assets', import.meta.url))
  },
  experimental: {
    localLayerAliases: false
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '#/*': ['../app/*']
        }
      }
    }
  },

  modules: ['@nuxt/content', '@unocss/nuxt'],
  content: {
    experimental: { sqliteConnector: 'native' }
  }
})
