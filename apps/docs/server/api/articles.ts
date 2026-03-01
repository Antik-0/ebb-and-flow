import { groupBy, random } from '@repo/utils'

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
    '/wallhaven-rrwvdq.webp',
    '/cover/wallhaven-6lm9w6.jpg',
    '/cover/wallhaven-9dwldk.jpg',
    '/cover/wallhaven-awd13a.jpg',
    '/cover/wallhaven-eaw661z.jpg',
    '/cover/wallhaven-jeeypy.jpg',
    '/cover/wallhaven-qrr12q.jpg',
    '/cover/wallhaven-xe761z.jpg',
    '/cover/wallhaven-xezkro.jpg'
  ]
  const length = covers.length

  const articles = groupBy(data, item =>
    new Date(item.lastUpdated!).getFullYear().toString()
  ) as unknown as Record<string, Article[]>

  const res = Object.values(articles)
    .flat()
    .map(item => {
      const index = random(0, length - 1)
      const cover = covers[index]
      return { cover, ...item }
    })

  return res
})
