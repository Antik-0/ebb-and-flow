import type { Metadata } from 'next'
import { EbbHome } from '#/theme'

export default function Page() {
  return <EbbHome />
}

export const metadata: Metadata = {
  title: '潮起潮落',
  description: '潮起潮落-主页'
}
