import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2026-03-30',
  devtools: { enabled: false },
  modules: ['@unocss/nuxt'],
  app: {
    head: {
      link: [{ rel: 'icon', href: '/avatar.png' }]
    },
    rootAttrs: { id: 'app' }
  },
  postcss: {
    plugins: {
      autoprefixer: false
    }
  },
  experimental: {
    localLayerAliases: false
  },
  typescript: {
    includeWorkspace: true,
    tsConfig: {
      compilerOptions: {
        paths: {
          '#/*': ['../app/*']
        }
      }
    }
  },
  nitro: {
    alias: {
      '#db': fileURLToPath(new URL('../../data/api.ts', import.meta.url))
    },
    typescript: {
      tsConfig: {
        compilerOptions: {
          paths: {
            '#db': ['../../../data/api.ts']
          }
        }
      }
    }
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'iconify-icon'
    }
  },
  vite: {
    optimizeDeps: {
      include: ['motion-v', 'iconify-icon']
    }
  },
  telemetry: false
})
