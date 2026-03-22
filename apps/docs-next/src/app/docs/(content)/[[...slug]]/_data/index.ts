import type { MarkdownData } from 'ebb-docs'
import { loadSource } from 'ebb-docs'

export async function getPageData(path: string) {
  const source = await loadSource()
  let data: MarkdownData | null = null
  if (path in source) {
    data = (source as any)[path] as MarkdownData
  }
  return data
}

export async function getPageSlugs() {
  const source = await loadSource()
  const keys = Object.keys(source)
  return keys.map(key => ({ slug: key.slice(1).split('/') }))
}
