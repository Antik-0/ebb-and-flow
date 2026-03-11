import type { MarkdownData } from 'ebb-markdown'
import Source from '#source/source.json' with { type: 'json' }

interface RequestBody {
  path: string
}

export default defineEventHandler(async event => {
  const body = (await readBody(event)) as RequestBody
  const path = body.path
  if (path in Source) {
    return (Source as any)[path] as MarkdownData
  } else {
    return null
  }
})
