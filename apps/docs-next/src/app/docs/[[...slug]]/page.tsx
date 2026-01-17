import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { source } from '#/lib/source'
import { EbbDocContent } from '#/theme'

export default function Page({
  params
}: {
  params: Promise<{ slug: string[] }>
}) {
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

export const metadata: Metadata = {
  title: '主要文章'
}
