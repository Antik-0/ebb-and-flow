'use client'
import { clsx, formatDate, formatDateTime } from '@repo/utils'

interface Props {
  tags?: string[]
  readingTime?: number
  lastUpdated?: number
}

export function PageMeta(props: Props) {
  const { tags = [], lastUpdated, readingTime } = props

  return (
    <div className="my-4">
      <PageTags tags={tags} />
      <div className="mx-auto py-2 flex gap-8 flex-center">
        <span
          className={clsx(
            'text-xs text-accent-foreground flex-1',
            lastUpdated ? 'text-right' : 'text-center'
          )}
        >
          <span className="mr-1">🕝</span>
          <span>预计阅读时间 {readingTime} 分钟</span>
        </span>
        <PageLastUpdated value={lastUpdated} />
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

function PageLastUpdated(props: { value?: number }) {
  if (!props.value) return null

  const lastUpdated = formatDate(props.value)
  const fulltime = formatDateTime(props.value, { timeStyle: 'full' })
  return (
    <div className="text-xs text-accent-foreground flex-1">
      <span className="mr-1">最后更新于</span>
      <time dateTime={fulltime}>{lastUpdated}</time>
    </div>
  )
}
