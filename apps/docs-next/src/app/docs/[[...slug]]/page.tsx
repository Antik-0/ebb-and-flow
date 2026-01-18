import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { source } from '#/lib/source'
import { EbbDocContent } from '#/theme'
import { themeConfig } from '#/theme.config'
import { formatTitle } from '#/utils'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export default function Page({ params }: PageProps) {
  const { slug } = use(params)
  const pageData = use(source(slug))

  if (!pageData) {
    notFound()
  }

  const { MDXContent, metadata } = pageData

  return (
    <EbbDocContent page={metadata}>
      <MDXContent />
    </EbbDocContent>
  )
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const pageData = await source(slug)

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
