import type { Metadata } from 'next'
import { EbbLayoutHome } from '@ebb/theme'

export const metadata: Metadata = {
  title: '潮起潮落',
  description: '潮起潮落首页'
}

export default function HomePage() {
  return <EbbLayoutHome />
}
