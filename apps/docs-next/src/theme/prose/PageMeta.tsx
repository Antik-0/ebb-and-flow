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
      <div className="mx-auto flex flex-center gap-8 py-2">
        <span
          className={clsx(
            'flex-1 text-accent-foreground text-xs',
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
    <div className="mx-auto flex w-[max-content] items-center gap-2">
      <span className="mr-1 text-sm">🏷️</span>
      {tags.map((tag, index) => (
        <span className="text-brand text-sm" key={index}>
          #{tag}
        </span>
      ))}
      <span className="ml-1 text-sm">🏷️</span>
    </div>
  )
}

function PageLastUpdated(props: { value?: number }) {
  if (!props.value) return null

  const lastUpdated = formatDate(props.value)
  const fulltime = formatDateTime(props.value, { timeStyle: 'full' })
  return (
    <div className="flex-1 text-accent-foreground text-xs">
      <span className="mr-1">最后更新于</span>
      <time dateTime={fulltime}>{lastUpdated}</time>
    </div>
  )
}
