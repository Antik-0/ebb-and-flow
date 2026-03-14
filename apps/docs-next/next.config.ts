import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: 'tsconfig.app.json'
  },
  pageExtensions: ['tsx']
}

export default nextConfig
