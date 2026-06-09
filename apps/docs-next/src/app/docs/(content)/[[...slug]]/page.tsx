import type { MarkdownData } from 'ebb-markdown'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentRender } from '#/render'
import { EbbDocContent } from '#/theme'
import { themeConfig } from '#/theme.config'
import { formatTitle } from '#/utils'
import { $api } from '#/utils/api'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

async function getPageData(path: string) {
  const res = await $api('/article', {
    method: 'POST',
    body: JSON.stringify({ path })
  })
  return (await res.json()) as MarkdownData
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const path = '/' + slug.map(s => decodeURIComponent(s)).join('/')
  const data = await getPageData(path)
  if (!data) {
    notFound()
  }
  const metadata = data.metadata

  return (
    <EbbDocContent page={metadata}>
      <ContentRender data={data} path={path} />
    </EbbDocContent>
  )
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const path = '/' + slug.join('/')

  const data = await getPageData(path)
  if (!data) {
    return {
      title: formatTitle(themeConfig.notFoundTitle ?? '404'),
      description: 'The page you are looking for does not exist.'
    }
  }
  const title = data.metadata.title
  const tags = data.frontmatter?.tags ?? []
  const description = tags ? `潮起潮落: ${tags.join(' ')}` : '潮起潮落'
  return { title, description }
}
