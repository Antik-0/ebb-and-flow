import type { MarkdownData } from 'ebb-markdown'
import { desc } from 'drizzle-orm'
import db from './db.ts'
import { articles } from './schema.ts'

export async function getArticle(path: string) {
  const data = await db.query.articles.findFirst({ where: { path } })
  if (!data) return null

  const metadata = {
    title: data.title,
    toc: data.toc,
    lastUpdated: data.lastUpdated,
    readingTime: data.readingTime
  }
  return {
    metadata,
    body: data.body,
    frontmatter: data.frontmatter
  } as MarkdownData
}

export async function getArchive() {
  const values = await db
    .select({
      id: articles.id,
      path: articles.path,
      title: articles.title,
      lastUpdated: articles.lastUpdated,
      frontmatter: articles.frontmatter
    })
    .from(articles)
    .orderBy(desc(articles.lastUpdated))

  let index = 0
  const length = covers.length

  const result = values.map(item => {
    const { frontmatter, ...rest } = item
    const tags = (frontmatter?.tags ?? []) as string[]
    const cover = covers[index]!
    index = (index + 1) % length

    return { cover, tags, ...rest }
  })

  return result
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
