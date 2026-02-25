import { clsx } from '@repo/utils'
import { computed, defineComponent } from 'vue'
import { useActiveRange, useOutline } from '#/controller/outline'

export default defineComponent(
  () => {
    const { anchors } = useOutline()

    return () => (
      <nav
        aria-label="outline"
        class="pl-4 border-l-2 border-divider relative isolate"
      >
        <OutlineMark />
        <div class="text-14px text-accent-foreground leading-8 font-600">
          页面导航
        </div>
        <ul>
          {anchors.value.map((item, index) => (
            <OutlineItem
              index={index}
              level={item.level}
              text={item.text}
              to={item.to}
            />
          ))}
        </ul>
      </nav>
    )
  },
  { name: 'Outline' }
)

interface OutlineItemProps {
  to: string
  text: string
  index: number
  level: number
}

const OutlineItem = defineComponent<OutlineItemProps>(
  props => {
    const activeRange = useActiveRange()

    const isActive = computed(() => {
      const { start, end } = activeRange
      const index = props.index
      return index >= start && index <= end
    })

    return () => (
      <li
        class={clsx(
          'text-14px text-muted-foreground leading-8 overflow-hidden',
          'data-[active=true]:text-brand-2 hover:text-brand-2'
        )}
        data-active={isActive.value}
        style={{
          '--level': props.level,
          padding: '0 calc(var(--level, 0) * 16px)'
        }}
      >
        <a class="block truncate" href={props.to} title={props.text}>
          {props.text}
        </a>
      </li>
    )
  },
  {
    name: 'OutlineItem',
    props: ['to', 'text', 'index', 'level']
  }
)

const OutlineMark = defineComponent(
  () => {
    const activeRange = useActiveRange()
    const visible = computed(() => activeRange.start !== -1)

    const offset = computed(() => {
      const { start } = activeRange
      return (start + 1) * 32
    })

    const scale = computed(() => {
      const { start, end } = activeRange
      return end - start + 1
    })

    return () => (
      <div
        class={clsx(
          'border-l-2 border-brand-2 bg-brand-2/20 h-8 inset-x-0 absolute -ml-[2px] -z-1',
          'transform-origin-top-center transition-transform duration-200'
        )}
        style={{
          translate: `0 ${offset.value}px`,
          scale: `1 ${scale.value}  `
        }}
        v-show={visible.value}
      ></div>
    )
  },
  { name: 'OutlineMark' }
)
