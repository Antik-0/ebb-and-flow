import type { MarkdownData } from 'ebb-docs'
import { loadSource } from 'ebb-docs'

interface RequestBody {
  path: string
}

export default defineEventHandler(async event => {
  const source = await loadSource()

  const body = (await readBody(event)) as RequestBody
  const path = body.path

  let data: MarkdownData | null = null
  if (path in source) {
    data = (source as any)[path] as MarkdownData
  }
  return { data }
})
