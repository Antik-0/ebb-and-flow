import { groupBy } from '@repo/utils'

interface Article {
  title: string
  path: string
  tags?: string[]
  lastUpdated: string
}

export default defineEventHandler(async event => {
  // 获取所有文章，按照更新时间排序，同时按照年份分组
  const data = await queryCollection(event, 'content')
    .select('title', 'path', 'tags', 'lastUpdated')
    .order('lastUpdated', 'DESC')
    .all()

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
  let index = 0

  const articles = groupBy(data, item =>
    new Date(item.lastUpdated!).getFullYear().toString()
  ) as unknown as Record<string, Article[]>

  const res = Object.values(articles)
    .flat()
    .map(item => {
      const cover = covers[index]
      index = (index + 1) % length
      return { cover, ...item }
    })

  return res
})
