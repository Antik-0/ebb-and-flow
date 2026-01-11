'use client'
import { usePathname } from 'next/navigation'

export default function Page() {
  const pathname = usePathname()

  return (
    <div className="text-rose-400">
      <span>hello,world</span>
    </div>
  )
}
