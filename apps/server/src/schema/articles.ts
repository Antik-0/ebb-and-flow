import type { Frontmatter, TocItem, VNode } from 'ebb-markdown'
import { defineRelations } from 'drizzle-orm'
import {
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
    hash: text().notNull(),
    title: text().notNull(),
    toc: text({ mode: 'json' }).notNull().$type<TocItem[]>(),
    body: text({ mode: 'json' }).notNull().$type<VNode[]>(),
    content: text().notNull(),
    lastUpdated: integer().notNull(),
    readingTime: integer().notNull(),
    frontmatter: text({ mode: 'json' }).$type<Frontmatter>()
  },
  table => [uniqueIndex('path').on(table.path)]
)

export const relations = defineRelations({ articles })
