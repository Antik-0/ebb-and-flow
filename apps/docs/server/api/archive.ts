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
  'https://antik-yuyi.me/webp/wallhaven-3qrol9.webp',
  'https://antik-yuyi.me/webp/wallhaven-gw2zpq.webp',
  'https://antik-yuyi.me/webp/wallhaven-yqv7xx.webp',
  'https://antik-yuyi.me/webp/wallhaven-8grg3j.webp',
  'https://antik-yuyi.me/webp/wallhaven-k8kgz1.webp',
  'https://antik-yuyi.me/webp/wallhaven-9mxxvd.webp',
  'https://antik-yuyi.me/webp/wallhaven-9om1lk.webp',
  'https://antik-yuyi.me/webp/wallhaven-eov7yl.webp',
  'https://antik-yuyi.me/webp/wallhaven-lykqqq.webp',
  'https://antik-yuyi.me/webp/wallhaven-zp5pwy.webp',
  'https://antik-yuyi.me/webp/wallhaven-1qr1y3.webp',
  'https://antik-yuyi.me/webp/wallhaven-576pq3.webp',
  'https://antik-yuyi.me/webp/wallhaven-l39zlr.webp',
  'https://antik-yuyi.me/webp/wallhaven-rrwvdq.webp',
  'https://antik-yuyi.me/webp/wallhaven-xepeld.webp'
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
