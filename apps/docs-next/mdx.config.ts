import type { RehypeShikiOptions, RemarkMetadataOptions } from '@ebb/mdx'
import {
  rehypePatch,
  rehypeShiki,
  remarkFrontmatter,
  remarkMetadata
} from '@ebb/mdx'
import { defineMDXConfig } from '@ebb/mdx/source'

export default defineMDXConfig({
  dir: './src/content',
  remarkPlugins: [
    [remarkFrontmatter],
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
})
