import type { MarkdownData } from 'ebb-markdown'

export type { MarkdownData }

export async function loadSource() {
  const sourceJSON = (await import('./.data/source.json', {
    with: { type: 'json' }
  })) as any
  return sourceJSON.default as Record<string, MarkdownData>
}
