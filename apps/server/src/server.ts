import { ebbEnv } from 'ebb-env'
import pc from 'picocolors'
import { getArchive, getArticle } from './api.ts'

const server = Bun.serve({
  port: ebbEnv.EBB_SERVER_PORT,
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

console.log(pc.red(`Server running at ${server.url}`) + '\n')
console.log(pc.cyan('ok'))
