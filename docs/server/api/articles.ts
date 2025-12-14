interface Article {
  title: string
  path: string
  lastUpdated: string
}

export default defineEventHandler(async event => {
  const data = (await queryCollection(event, 'content')
    .select('title', 'path', 'lastUpdated')
    .all()) as Article[]

  return {
    articles: data,
    total: data.length
  }
})
