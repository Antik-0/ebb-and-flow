// @ts-nocheck: no type
import contentIndex from '#content'

interface SourceEntry {
  Content: any
  metadata: PageMetadata
}

async function getPage(...path: string[]) {
  try {
    const key = path.join('/')
    const loader = contentIndex[key]
    const module = await loader()
    if (!module) return null

    const Content = module.default
    const metadata = module._metadata
    return { Content, metadata } as SourceEntry
  } catch {
    return null
  }
}

async function getPages() {
  const paths = Object.keys(contentIndex)
  return await Promise.all(paths.map(path => getPage(path)))
}

function getSlugs() {
  const paths = Object.keys(contentIndex)
  return paths.map(path => ({ slug: path.split('/') }))
}

export const source = {
  getPage,
  getPages,
  getSlugs
}
