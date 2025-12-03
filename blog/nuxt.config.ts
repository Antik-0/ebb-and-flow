import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  app: {
    head: {
      link: [{ rel: 'icon', href: '/logo.png' }]
    },
    rootAttrs: {
      id: 'app'
    }
  },

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
