export default defineNuxtConfig({
  compatibilityDate: '2026-03-30',
  devtools: { enabled: false },
  modules: ['@unocss/nuxt'],
  app: {
    head: {
      link: [{ rel: 'icon', href: '/avatar.png' }],
      htmlAttrs: {
        class: 'dark',
        lang: 'zh-CN'
      }
    },
    rootAttrs: {
      id: 'app'
    }
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
  },
  telemetry: false
})
