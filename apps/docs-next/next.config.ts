import type { RehypeShikiOptions, RemarkMetadataOptions } from '@ebb/mdx'
import type { NextConfig } from 'next'
import {
  rehypePatch,
  rehypeShiki,
  remarkFrontmatter,
  remarkMetadata
} from '@ebb/mdx'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['tsx', 'mdx']
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      [
        remarkFrontmatter,
        {
          test: 111
        }
      ],
      [
        remarkMetadata,
        {
          name: '_metadata',
          setup(_, file) {
            return file.data.matters as any
          },
          tocDepth: [2, 3]
        } satisfies RemarkMetadataOptions
      ]
    ],
    rehypePlugins: [
      [
        rehypeShiki,
        {
          theme: 'vitesse'
        } satisfies RehypeShikiOptions
      ],
      [rehypePatch]
    ]
  }
})

export default withMDX(nextConfig)
