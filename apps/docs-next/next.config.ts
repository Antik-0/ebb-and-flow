import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: 'tsconfig.app.json'
  },
  pageExtensions: ['ts', 'tsx']
}

export default nextConfig
