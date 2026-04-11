import { clsx } from '@repo/utils'
import { stylex } from '#/utils'
import { uesPage } from '../../controller/layout'
import {
  createSVGMask,
  useOutline,
  useTocActive
} from '../../controller/outline'
import { TextAlignStart } from '../../icons'

export function DocOutline() {
  const { toc } = useOutline()

  return (
    <nav aria-label="outline" className="relative isolate">
      <div className="flex items-center gap-2 text-accent-foreground">
        <TextAlignStart className="size-5" />
        <span className="flex-1 font-600 text-14px leading-8">页面导航</span>
      </div>
      <OutlineMark />
      <OutlineMask />
      <ul data-role="list">
        {toc.map((item, index) => (
          <TocItem
            id={item.id}
            index={index}
            key={index}
            label={item.label}
            level={item.level - 1}
          />
        ))}
      </ul>
    </nav>
  )
}

interface TocItemProps {
  id: string
  index: number
  label: string
  level: number
}

function TocItem(props: TocItemProps) {
  const { id, index, label, level } = props
  const { start, end } = useTocActive(state => state)
  const isActive = index >= start && index <= end

  return (
    <li
      className={clsx(
        'overflow-hidden text-14px text-muted-foreground leading-8',
        'pr-4 pl-[calc(var(--level)*16px)]',
        'hover:text-brand-2 data-[active=true]:text-brand-2'
      )}
      data-active={isActive}
      style={stylex({ '--level': level })}
    >
      <a className="block truncate" href={`#${id}`} title={label}>
        {label}
      </a>
    </li>
  )
}

function OutlineMark() {
  const { start, end } = useTocActive(state => state)
  const offset = start * 32
  const scale = start === -1 ? 0 : end - start + 1

  return (
    <div
      aria-hidden="true"
      className={clsx(
        'absolute inset-x-0 top-8 -z-2 h-8 bg-brand-2/10',
        'transform-origin-top-center transition-transform duration-300'
      )}
      data-role="mark"
      style={{
        scale: `1 ${scale}`,
        translate: `0 ${offset}px`
      }}
    ></div>
  )
}

function OutlineMask() {
  const toc = uesPage(state => state.toc ?? [])
  const { width, height, path, maskURL } = createSVGMask(toc)

  return (
    <div
      aria-hidden="true"
      className="absolute top-8 left-0 -z-1 text-muted-foreground"
      data-role="mask"
      style={{ width: width + 'px', height: height + 'px' }}
    >
      <MaskSvg height={height} path={path} width={width} />
      <div
        className="absolute inset-0 z-10"
        style={{ maskImage: `url('${maskURL}')` }}
      >
        <MaskIndicator />
      </div>
    </div>
  )
}

function MaskIndicator() {
  const { start, end } = useTocActive(state => state)
  const offset = start * 32 + 4
  const height = (end - start + 1) * 32
  const scale = (height - 8) / 24

  return (
    <div
      className={clsx(
        'absolute h-6 w-full bg-brand-2',
        'transform-origin-top-center transition-transform duration-600'
      )}
      data-role="indicator"
      style={{
        scale: `1 ${scale}`,
        translate: `0 ${offset}px`
      }}
    ></div>
  )
}

interface MaskSvgProps {
  width: number
  height: number
  path: string
}

function MaskSvg(props: MaskSvgProps) {
  const { width, height, path } = props
  return (
    <svg
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1} />
    </svg>
  )
}
