import type { EmptyRelations } from 'drizzle-orm'
import type { SQLiteBunDatabase } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import { eq, getColumns } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { articles } from './schema.ts'

export class EbbDatabase {
  public db: SQLiteBunDatabase<Record<string, any>, EmptyRelations> & {
    $client: Database
  }

  constructor() {
    const sqlURL = Bun.fileURLToPath(
      new URL('../.data/ebb.sqlite', import.meta.url)
    )
    const client = new Database(sqlURL)
    this.db = drizzle({ client })
  }

  public async getArticle(path: string) {
    const values = await this.db
      .select(getColumns(articles))
      .from(articles)
      .where(eq(articles.path, path))

    const data = values[0]
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
    }
  }
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
