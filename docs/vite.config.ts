import { URL, fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command }) => {
  const plugins: PluginOption[] = [UnoCSS()]

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
