import type { Metadata } from 'next'
import { EbbLayoutHome } from '#/theme'
import { themeConfig } from '#/theme.config'

export default function Home() {
  return <EbbLayoutHome />
}

export const metadata: Metadata = {
  title: themeConfig.title,
  description: themeConfig.title
}
