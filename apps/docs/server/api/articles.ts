import type { MarkdownData } from 'ebb-docs'
import { loadSource } from 'ebb-docs'

interface Article {
  title: string
  cover: string
  path: string
  tags?: string[]
  lastUpdated: number
}

const covers = [
  'https://antik-yuyi.me/webp/wallhaven-9om1lk.webp',
  'https://antik-yuyi.me/webp/wallhaven-9mxxvd.webp',
  'https://antik-yuyi.me/webp/wallhaven-576pq3.webp',
  'https://antik-yuyi.me/webp/wallhaven-6lm9w6.webp',
  'https://antik-yuyi.me/webp/wallhaven-gjz69l.webp',
  'https://antik-yuyi.me/webp/wallhaven-xe761z.webp',
  'https://antik-yuyi.me/webp/wallhaven-jeeypy.webp',
  'https://antik-yuyi.me/webp/wallhaven-l39zlr.webp',
  'https://antik-yuyi.me/webp/wallhaven-qrr12q.webp',
  'https://antik-yuyi.me/webp/wallhaven-z8gg7g.webp',
  'https://antik-yuyi.me/webp/wallhaven-9dwldk.webp',
  'https://antik-yuyi.me/webp/wallhaven-4gmloe.webp',
  'https://antik-yuyi.me/webp/wallhaven-od6v2l.webp',
  'https://antik-yuyi.me/webp/wallhaven-eaw661z.webp',
  'https://antik-yuyi.me/webp/wallhaven-awd13a.webp',
  'https://antik-yuyi.me/webp/wallhaven-rrwvdq.webp'
]
const length = covers.length

export default defineEventHandler(async () => {
  const source = await loadSource()

  let index = 0
  const res: Article[] = []
  for (const path of Object.keys(source)) {
    const data = source[path as keyof typeof source] as unknown as MarkdownData
    const metadata = data.metadata
    const frontmatter = data.frontmatter

    res.push({
      path,
      title: metadata.title,
      cover: covers[index]!,
      tags: frontmatter?.tags ?? [],
      lastUpdated: metadata.lastUpdated!
    })
    index = (index + 1) % length
  }

  // 按修改时间降序
  const data = res.toSorted(
    (a, b) => (b.lastUpdated ?? 0) - (a.lastUpdated ?? 0)
  )
  return { data }
})
