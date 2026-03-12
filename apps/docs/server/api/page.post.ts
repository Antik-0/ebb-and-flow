import type { MarkdownData } from 'ebb-markdown'

interface RequestBody {
  path: string
}

export default defineEventHandler(async event => {
  const sourceJSON = (await import('../../.data/source.json', {
    with: { type: 'json' }
  })) as any
  const source = sourceJSON.default as Record<string, MarkdownData>

  const body = (await readBody(event)) as RequestBody
  const path = body.path

  let data: MarkdownData | null = null
  if (path in source) {
    data = (source as any)[path] as MarkdownData
  }
  return { data }
})
