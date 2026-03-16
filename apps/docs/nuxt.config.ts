import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2026-03-21',
  devtools: { enabled: false },
  modules: ['@unocss/nuxt'],
  app: {
    head: {
      link: [{ rel: 'icon', href: '/avatar.png' }],
      htmlAttrs: {
        class: 'dark',
        lang: 'zh-cn'
      }
    },
    rootAttrs: {
      id: 'app'
    }
  },
  css: ['~/assets/main.css', 'ebb-ui/main.css'],
  postcss: {
    plugins: {
      autoprefixer: false
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
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'iconify-icon'
    }
  },
  vite: {
    optimizeDeps: {
      include: ['motion-v', 'iconify-icon']
    }
  }
})
