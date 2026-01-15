import { use } from 'react'
import { source } from '#/lib/source'
import { EbbDocContent } from '#/theme'

export default function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { MDXContent, metadata } = use(source())

  return (
    <EbbDocContent page={metadata}>
      <MDXContent />
    </EbbDocContent>
  )
}
