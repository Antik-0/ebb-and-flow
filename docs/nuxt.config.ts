import { execSync } from 'node:child_process'
import { URL, fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  app: {
    head: {
      link: [{ rel: 'icon', href: '/logo.png' }],
      htmlAttrs: {
        class: 'dark',
        lang: 'zh-cn'
      }
    },
    rootAttrs: {
      id: 'app'
    }
  },

  css: ['~/assets/main.css', '@repo/theme/styles/main.css'],

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
    build: {
      markdown: {
        toc: {
          depth: 3
        },
        highlight: {
          theme: 'github-dark'
        }
      }
    },
    experimental: { sqliteConnector: 'native' }
  },
  hooks: {
    'content:file:afterParse': ctx => {
      const { file, content } = ctx
      content.lastUpdated = getGitUpdated(file.path)
    }
  }
})

function getGitUpdated(filepath: string) {
  try {
    const lastUpdated = execSync(
      `git log -1 --pretty=format:%cI -- ${filepath}`
    ).toString()
    return lastUpdated
  } catch {
    return undefined
  }
}
