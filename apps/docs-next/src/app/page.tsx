import type { Metadata } from 'next'
import { EbbLayoutHome } from '#/theme'
import 'ebb-ui/pages/home.css'

export default function Home() {
  return <EbbLayoutHome />
}

export const metadata: Metadata = {
  title: '潮起潮落',
  description: '潮起潮落-主页'
}
