import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: 'tsconfig.app.json'
  },
  pageExtensions: ['tsx']
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/
})

export default withMDX(nextConfig)
