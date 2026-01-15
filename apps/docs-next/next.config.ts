import type { RehypeShikiOptions, RemarkMetadataOptions } from '@ebb/mdx'
import type { NextConfig } from 'next'
import { rehypePatch, rehypeShiki, remarkMetadata } from '@ebb/mdx'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['tsx', 'mdx']
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      [
        remarkMetadata,
        {
          name: '_metadata',
          tocDepth: [2, 3]
        } satisfies RemarkMetadataOptions
      ]
    ],
    rehypePlugins: [
      [rehypePatch],
      [
        rehypeShiki,
        {
          theme: 'github-dark'
        } satisfies RehypeShikiOptions
      ]
    ]
  }
})

export default withMDX(nextConfig)
