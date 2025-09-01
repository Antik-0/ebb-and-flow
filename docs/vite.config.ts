import type { PluginOption } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'

export default defineConfig(({ command }) => {
  const plugins: PluginOption[] = [UnoCSS()]

  if (command === 'serve') {
    // plugins.push(vueDevTools())
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
