import type { FunctionalComponent } from 'vue'
import { clsx } from '@repo/utils'
import { computed, defineComponent } from 'vue'
import { createSVGMask, useActiveRange, useOutline } from '#/controller/outline'

export default defineComponent(
  () => {
    const { anchors } = useOutline()

    const { width, height, path, template } = createSVGMask(anchors.value)
    const maskURL = `data:image/svg+xml,${encodeURIComponent(template)}`

    return () => (
      <nav aria-label="outline" class="pl-4 relative isolate">
        <div
          class="text-muted-foreground left-0 top-8 absolute"
          style={{ width: width + 'px', height: height + 'px' }}
        >
          <MaskSvg height={height} path={path} width={width} />
          <div
            class="inset-0 absolute z-10"
            style={{ maskImage: `url('${maskURL}')` }}
          >
            <OutlineMark />
          </div>
        </div>
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
          'border-l-2 border-brand-2 bg-brand-2 h-8 inset-x-0 absolute -ml-[2px] -z-1',
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

interface MaskSvgProps {
  width: number
  height: number
  path: string
}

const MaskSvg: FunctionalComponent<MaskSvgProps> = props => {
  const { width, height, path } = props
  return (
    <svg
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} fill="none" stroke="currentColor" stroke-width={1} />
    </svg>
  )
}
