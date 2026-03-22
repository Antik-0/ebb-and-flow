import { clsx } from '@repo/utils'
import { stylex } from '#/utils'
import { uesPage } from '../../controller/layout'
import {
  createSVGMask,
  useActiveRange,
  useOutline
} from '../../controller/outline'
import { TextAlignStart } from '../../icons'

export function DocOutline() {
  const { toc } = useOutline()

  return (
    <nav aria-label="outline" className="relative isolate">
      <div className="text-accent-foreground flex gap-2 items-center">
        <TextAlignStart className="size-5" />
        <span className="text-14px leading-8 font-600 flex-1">页面导航</span>
      </div>
      <OutlineMark />
      <OutlineMask />
      <ul data-role="list">
        {toc.map((item, index) => (
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
}

interface TocItemProps {
  id: string
  index: number
  label: string
  level: number
}

function TocItem(props: TocItemProps) {
  const { id, index, label, level } = props
  const { start, end } = useActiveRange(state => state)
  const isActive = index >= start && index <= end

  return (
    <li
      className={clsx(
        'text-14px text-muted-foreground leading-8 overflow-hidden',
        'pl-[calc(var(--level)*16px)] pr-4',
        'data-[active=true]:text-brand-2 hover:text-brand-2'
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
  const { start, end } = useActiveRange(state => state)
  const offset = start * 32
  const scale = start === -1 ? 0 : end - start + 1

  return (
    <div
      aria-hidden="true"
      className={clsx(
        'bg-brand-2/10 h-8 inset-x-0 top-8 absolute -z-2',
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
      className="text-muted-foreground left-0 top-8 absolute -z-1"
      data-role="mask"
      style={{ width: width + 'px', height: height + 'px' }}
    >
      <MaskSvg height={height} path={path} width={width} />
      <div
        className="inset-0 absolute z-10"
        style={{ maskImage: `url('${maskURL}')` }}
      >
        <MaskIndicator />
      </div>
    </div>
  )
}

function MaskIndicator() {
  const { start, end } = useActiveRange(state => state)
  const offset = start * 32 + 4
  const height = (end - start + 1) * 32
  const scale = (height - 8) / 24

  return (
    <div
      className={clsx(
        'bg-brand-2 h-6 w-full absolute',
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
      <path d={path} fill="none" stroke="currentColor" stroke-width={1} />
    </svg>
  )
}
