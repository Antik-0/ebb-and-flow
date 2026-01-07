import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '潮起潮落',
  description: '潮起潮落首页'
}

export default function Page() {
  return (
    <div className="flex-col h-screen w-screen isolate">
      <div className="px-10 pb-20 pt-40 flex-col flex-1 items-center"></div>

      <div className="flex items-end inset-0 fixed -z-1">
        <div className="tidewater"></div>
      </div>
    </div>
  )
}
