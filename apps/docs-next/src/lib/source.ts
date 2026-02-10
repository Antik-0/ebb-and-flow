// @ts-nocheck - no type
import contentIndex from 'content'

interface SourceEntry {
  Content: any
  metadata: any
}

async function getPage(...path: string[]) {
  try {
    const key = path.join('/')
    const loader = contentIndex[key]
    if (!loader) return null
    const { default: Content, ...metadata } = await loader()
    return { Content, metadata } as SourceEntry
  } catch {
    return null
  }
}

function getPages() {
  const paths = Object.keys(contentIndex)
  return Promise.all(paths.map(path => getPage(path)))
}

export const source = {
  getPage,
  getPages
}
