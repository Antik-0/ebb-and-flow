import type { MDXContent } from 'mdx/types'
import { isPlainObject } from '@repo/utils'

interface MDXSource {
  MDXContent: MDXContent
  metadata: PageMetadata
}

export async function source() {
  const module = await import('#/content/article/link.mdx')
  const { default: MDXContent, ...data } = module

  const metadata = {} as PageMetadata

  for (const key in data) {
    const value = (data as any)[key] as unknown
    if (isPlainObject(value)) {
      Object.assign(metadata, value)
    } else {
      Reflect.set(metadata, key, value)
    }
  }

  return { MDXContent, metadata } as MDXSource
}
