import { clsx, formatDate, formatDateTime } from '@repo/utils'

interface Props {
  tags?: string[]
  readingTime?: number
  lastUpdated?: number
}

export function PageMeta(props: Props) {
  const { tags = [], readingTime, lastUpdated } = props

  return (
    <div class="my-4" data-role="pagemeta">
      <PageTags tags={tags} />
      <div class="mx-auto py-2 flex gap-8 flex-center">
        <span
          class={clsx(
            'text-xs text-accent-foreground flex-1',
            lastUpdated ? 'text-right' : 'text-center'
          )}
        >
          <span class="mr-1">🕝</span>
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
    <div class="mx-auto flex gap-2 w-[max-content] items-center">
      <span class="text-sm mr-1">🏷️</span>
      {tags.map((tag, index) => (
        <span class="text-sm text-brand" key={index}>
          #{tag}
        </span>
      ))}
      <span class="text-sm ml-1">🏷️</span>
    </div>
  )
}

function PageLastUpdated(props: { value?: number }) {
  if (!props.value) return null

  const lastUpdated = formatDate(props.value)
  const fulltime = formatDateTime(props.value, { timeStyle: 'full' })
  return (
    <div class="text-xs text-accent-foreground flex-1">
      <span class="mr-1">最后更新于</span>
      <time datetime={fulltime}>{lastUpdated}</time>
    </div>
  )
}
