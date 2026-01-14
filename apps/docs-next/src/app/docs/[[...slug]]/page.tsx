import { use } from 'react'
import { EbbDocContent } from '#/theme'

export default function Page({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = use(params)

  return (
    <EbbDocContent>
      <span>hello,world</span>
    </EbbDocContent>
  )
}
