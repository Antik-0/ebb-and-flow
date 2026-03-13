import type { FunctionalComponent } from 'vue'
import { clsx } from '@repo/utils'
import { computed, defineComponent, reactive, watch } from 'vue'
import { createSVGMask, useActiveRanve, useOutline } from '#/controller/outline'
import { TextAlignStart } from '#/icons'

export default defineComponent(
  () => {
    const { toc } = useOutline()

    return () => (
      <nav aria-label="outline" class="relative isolate">
        <div class="text-accent-foreground flex gap-2 items-center">
          <TextAlignStart class="size-5" />
          <span class="text-14px leading-8 font-600 flex-1">页面导航</span>
        </div>
        <OutlineMark />
        <OutlineMask />
        <ul data-role="list">
          {toc.value.map((item, index) => (
            <TocItem
              id={item.id}
              index={index}
              label={item.label}
              level={item.level - 1}
            />
          ))}
        </ul>
      </nav>
    )
  },
  { name: 'Outline' }
)

interface TocItemProps {
  id: string
  index: number
  label: string
  level: number
}

const TocItem = defineComponent<TocItemProps>(
  props => {
    const activeRange = useActiveRanve()

    const isActive = computed(() => {
      const { start, end } = activeRange
      const index = props.index
      return index >= start && index <= end
    })

    return () => (
      <li
        class={clsx(
          'text-14px text-muted-foreground leading-8 overflow-hidden',
          'pl-[calc(var(--level)*16px)] pr-4',
          'data-[active=true]:text-brand-2 hover:text-brand-2'
        )}
        data-active={isActive.value}
        style={{ '--level': props.level }}
      >
        <a class="block truncate" href={'#' + props.id} title={props.label}>
          {props.label}
        </a>
      </li>
    )
  },
  {
    name: 'TocItem',
    props: ['id', 'index', 'label', 'level']
  }
)

const OutlineMark = defineComponent(
  () => {
    const activeRange = useActiveRanve()

    const offset = computed(() => {
      return activeRange.start * 32
    })

    const scale = computed(() => {
      const { start, end } = activeRange
      if (start === -1) return 0
      return end - start + 1
    })

    return () => (
      <div
        aria-hidden="true"
        class={clsx(
          'bg-brand-2/10 h-8 inset-x-0 top-8 absolute -z-2',
          'transform-origin-top-center transition-transform duration-200'
        )}
        data-role="mark"
        style={{
          scale: `1 ${scale.value}`,
          translate: `0 ${offset.value}px`
        }}
      ></div>
    )
  },
  { name: 'OutlineMark' }
)

const OutlineMask = defineComponent(
  () => {
    const { toc } = useOutline()

    const { width, height, path, maskURL } = createSVGMask(toc.value)
    const svg = reactive({ width, height, path, maskURL })

    watch(
      () => toc.value,
      newValue => {
        Object.assign(svg, createSVGMask(newValue))
      }
    )

    return () => (
      <div
        aria-hidden="true"
        class="text-muted-foreground left-0 top-8 absolute -z-1"
        data-role="mask"
        style={{ width: svg.width + 'px', height: svg.height + 'px' }}
      >
        <MaskSvg height={svg.height} path={svg.path} width={svg.width} />
        <div
          class="inset-0 absolute z-10"
          style={{ maskImage: `url('${svg.maskURL}')` }}
        >
          <MaskIndicator />
        </div>
      </div>
    )
  },
  { name: 'OutlineMask' }
)

const MaskIndicator = defineComponent(() => {
  const activeRange = useActiveRanve()

  const offset = computed(() => {
    return activeRange.start * 32 + 4
  })

  const scale = computed(() => {
    const { start, end } = activeRange
    const height = (end - start + 1) * 32
    return (height - 8) / 24
  })

  return () => (
    <div
      class={clsx(
        'bg-brand-2 h-6 w-full absolute',
        'transform-origin-top-center transition-transform duration-600'
      )}
      data-role="indicator"
      style={{
        scale: `1 ${scale.value}`,
        translate: `0 ${offset.value}px`
      }}
    ></div>
  )
})

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
