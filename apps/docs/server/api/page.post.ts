import { getArticle } from '#db'

interface RequestBody {
  path: string
}

export default defineEventHandler(async event => {
  const body = (await readBody(event)) as RequestBody
  const data = await getArticle(body.path)
  return { data }
})
