import { getArchive, getArticle } from './api.ts'

const server = Bun.serve({
  port: 8080,
  routes: {
    '/archive': {
      GET: async () => {
        return Response.json(await getArchive())
      }
    },
    '/article': {
      POST: async request => {
        const body = (await request.json()) as { path: string }
        return Response.json(await getArticle(body.path))
      }
    }
  }
})

console.log(`Server running at ${server.url}`)
