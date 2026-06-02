import { getArticle } from '#db'

export async function getPageData(path: string) {
  const data = await getArticle(path)
  return data
}
