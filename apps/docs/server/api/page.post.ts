import type { MarkdownData } from 'ebb-markdown'

export default defineEventHandler(async event => {
  const res = await fetch('http://localhost:8080/article', {
    method: 'POST',
    body: await readBody(event)
  })
  return (await res.json()) as MarkdownData
})
