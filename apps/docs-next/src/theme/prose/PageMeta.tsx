'use client'
import { formatDateTime } from '@repo/utils'
import { usePageData } from '../controller/layout'

export function PageMeta() {
  const state = usePageData(state => state)
  const { tags = [], lastUpdated, readingTime } = state

  return (
    <div className="my-4">
      <PageTags tags={tags} />
      <div className="mx-auto py-2 flex gap-8 w-[max-content] items-center">
        <span className="text-xs text-accent-foreground">
          <span className="mr-1">🕝</span>
          <span>预计阅读时间 {readingTime} 分钟</span>
        </span>
        {lastUpdated && (
          <span className="text-xs text-accent-foreground" v-if="lastUpdated">
            <span className="mr-1">最后更新于</span>
            {formatDateTime(lastUpdated)}
          </span>
        )}
      </div>
    </div>
  )
}

function PageTags({ tags }: { tags: string[] }) {
  if (!tags.length) return null

  return (
    <div className="mx-auto flex gap-2 w-[max-content] items-center">
      <span className="text-sm mr-1">🏷️</span>
      {tags.map((tag, index) => (
        <span className="text-sm text-brand" key={index}>
          #{tag}
        </span>
      ))}
      <span className="text-sm ml-1">🏷️</span>
    </div>
  )
}
