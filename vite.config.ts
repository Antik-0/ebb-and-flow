import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import compression from 'vite-plugin-compression'
import vueDevTools from 'vite-plugin-vue-devtools'
import type { PluginOption } from 'vite'

export default defineConfig(({ command }) => {
  // path-alias
  const __dirname__ = resolve()
  const pathSrc = resolve(__dirname__, 'docs')
  const alias = {
    '@': pathSrc
  }

  const plugins: PluginOption[] = [compression()]
  if (command === 'serve') {
    plugins.push(vueDevTools())
  }

  return {
    base: './',
    resolve: { alias },
    plugins
  }
})
