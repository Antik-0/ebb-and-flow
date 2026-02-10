import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { MDXContent } from '#/Content'
import { source } from '#/lib/source'
import { EbbDocContent } from '#/theme'
import { themeConfig } from '#/theme.config'
import { formatTitle } from '#/utils'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export default function Page({ params }: PageProps) {
  const { slug } = use(params)

  const data = use(source.getPage(...slug))

  const pageData = undefined as any

  if (!pageData) {
    notFound()
  }

  const { Content, metadata } = pageData

  console.log(metadata)

  return (
    <EbbDocContent page={metadata}>
      <MDXContent Render={Content} />
    </EbbDocContent>
  )
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const pageData = undefined as any

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
