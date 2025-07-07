import { URL, fileURLToPath } from 'node:url'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command }) => {
  const plugins: PluginOption[] = []
  if (command === 'serve') {
    plugins.push(vueDevTools())
  } else {
    plugins.push((compression as any)())
  }

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./assets', import.meta.url))
      }
    },
    plugins
  }
})
