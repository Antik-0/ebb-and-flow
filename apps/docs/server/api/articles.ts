import { groupBy } from '@repo/utils'

interface Article {
  title: string
  path: string
  tags: string[]
  lastUpdated: string
}

export default defineEventHandler(async event => {
  // 获取所有文章，按照更新时间排序，同时按照年份分组
  const data = await queryCollection(event, 'content')
    .select('title', 'path', 'tags', 'lastUpdated')
    .order('lastUpdated', 'DESC')
    .all()

  const articles = groupBy<Article>(data, item =>
    new Date(item.lastUpdated).getFullYear().toString()
  )

  return articles
})
