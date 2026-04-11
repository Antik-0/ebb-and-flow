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
      <div class="mx-auto flex flex-center gap-8 py-2">
        <span
          class={clsx(
            'flex-1 text-accent-foreground text-xs',
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
    <div class="mx-auto flex w-[max-content] items-center gap-2">
      <span class="mr-1 text-sm">🏷️</span>
      {tags.map((tag, index) => (
        <span class="text-brand text-sm" key={index}>
          #{tag}
        </span>
      ))}
      <span class="ml-1 text-sm">🏷️</span>
    </div>
  )
}

function PageLastUpdated(props: { value?: number }) {
  if (!props.value) return null

  const lastUpdated = formatDate(props.value)
  const fulltime = formatDateTime(props.value, { timeStyle: 'full' })
  return (
    <div class="flex-1 text-accent-foreground text-xs">
      <span class="mr-1">最后更新于</span>
      <time datetime={fulltime}>{lastUpdated}</time>
    </div>
  )
}
