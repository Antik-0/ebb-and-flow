import type { MarkdownData } from 'ebb-markdown'

export async function getPageData(path: string) {
  const res = await fetch('http://localhost:8080/article', {
    method: 'POST',
    body: JSON.stringify({ path })
  })
  return (await res.json()) as MarkdownData
}
