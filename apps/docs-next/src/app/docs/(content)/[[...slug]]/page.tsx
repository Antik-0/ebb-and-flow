import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentRender } from '#/render'
import { EbbDocContent } from '#/theme'
import { themeConfig } from '#/theme.config'
import { formatTitle } from '#/utils'
import { getPageData, getPageSlugs } from './_data'

interface PageProps {
  params: Promise<{ slug: string[] }>
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

export async function generateStaticParams() {
  return await getPageSlugs()
}
