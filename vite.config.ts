import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import compression from 'vite-plugin-compression'

export default defineConfig(({ command, mode }) => {
  // path-alias
  const __dirname__ = resolve()
  const pathSrc = resolve(__dirname__, 'docs')
  const alias = {
    '@': pathSrc
  }

  return {
    base: './',
    resolve: { alias },
    plugins: [compression()]
  }
})
