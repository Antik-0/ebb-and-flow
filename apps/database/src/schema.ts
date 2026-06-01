import type { Frontmatter, TocItem, VNode } from 'ebb-markdown'
import {
  blob,
  integer,
  sqliteTable as table,
  text,
  uniqueIndex
} from 'drizzle-orm/sqlite-core'

export const articles = table(
  'articles',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    path: text().notNull(),
    hash: blob({ mode: 'bigint' }).notNull(),
    title: text().notNull(),
    toc: text({ mode: 'json' }).$type<TocItem[]>(),
    body: text({ mode: 'json' }).$type<VNode[]>(),
    content: text().notNull(),
    lastUpdated: integer(),
    readingTime: integer(),
    frontmatter: text({ mode: 'json' }).$type<Frontmatter>()
  },
  table => [uniqueIndex('path').on(table.path)]
)
