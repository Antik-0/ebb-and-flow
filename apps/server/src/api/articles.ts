import type { MarkdownData } from 'ebb-markdown'
import { desc } from 'drizzle-orm'
import db from '#/db.ts'
import { articles } from '#/schema/articles.ts'

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
  'https://antik-yuyi.me/cdn/wallhaven-1q2w63.webp',
  'https://antik-yuyi.me/cdn/wallhaven-3qrol9.webp',
  'https://antik-yuyi.me/cdn/wallhaven-6lemmw.webp',
  'https://antik-yuyi.me/cdn/wallhaven-7jxxp3.webp',
  'https://antik-yuyi.me/cdn/wallhaven-9mxxvd.webp',
  'https://antik-yuyi.me/cdn/wallhaven-9om1lk.webp',
  'https://antik-yuyi.me/cdn/wallhaven-216xmy.webp',
  'https://antik-yuyi.me/cdn/wallhaven-e8v2do.webp',
  'https://antik-yuyi.me/cdn/wallhaven-e8vvx8.webp',
  'https://antik-yuyi.me/cdn/wallhaven-jedeww.webp',
  'https://antik-yuyi.me/cdn/wallhaven-k8kgz1.webp',
  'https://antik-yuyi.me/cdn/wallhaven-mly2vm.webp',
  'https://antik-yuyi.me/cdn/wallhaven-rrwvdq.webp',
  'https://antik-yuyi.me/cdn/wallhaven-vp23lp.webp',
  'https://antik-yuyi.me/cdn/wallhaven-yqkwg7.webp',
  'https://antik-yuyi.me/cdn/wallhaven-zpvvyo.webp'
]
