import type { MarkdownData } from 'ebb-markdown'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const res = await $api('/article', {
    method: 'POST',
    body: JSON.stringify(body)
  })
  return (await res.json()) as MarkdownData
})
