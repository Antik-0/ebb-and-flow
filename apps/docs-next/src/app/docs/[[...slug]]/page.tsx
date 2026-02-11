import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { source } from '#/lib/source'
import { MDXContent } from '#/MDXContent'
import { EbbDocContent } from '#/theme'
import { themeConfig } from '#/theme.config'
import { formatTitle } from '#/utils'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const pageData = undefined as any

  if (!pageData) {
    notFound()
  }

  const { Content, metadata } = pageData

  return (
    <EbbDocContent page={metadata}>
      <MDXContent content={Content} />
    </EbbDocContent>
  )
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const pageData = await source.getPage(...slug)

  if (!pageData) {
    return {
      title: formatTitle(themeConfig.notFoundTitle ?? '404'),
      description: 'The page you are looking for does not exist.'
    }
  }

  const { title, tags } = pageData.metadata
  const description = tags ? `潮起潮落: ${tags.join(' ')}` : '潮起潮落'
  return { title, description }
}

export function generateStaticParams() {
  return source.getSlugs()
}
