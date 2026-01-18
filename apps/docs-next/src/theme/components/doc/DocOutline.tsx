import { clsx } from '@repo/utils'
import { stylex } from '#/utils'
import { useOutline } from '../../controller/outline'

export function DocOutline() {
  const { anchors, activeIndex } = useOutline()
  const marketOffset = (activeIndex + 1) * 32

  return (
    <nav
      aria-label="outline"
      className="pl-4 border-l-2 border-divider relative isolate"
    >
      <div
        className="border-l-2 border-brand-2 bg-brand-2/20 h-8 transition-transform duration-200 inset-x-0 absolute -ml-[2px] -z-1"
        style={stylex({
          display: activeIndex === -1 && 'none',
          translate: `0 ${marketOffset}px`
        })}
      ></div>
      <div className="text-14px text-accent-foreground leading-8 font-600">
        页面导航
      </div>
      <ul>
        {anchors.map((anchor, index) => (
          <li
            className={clsx(
              'outline-item',
              index === activeIndex && 'is-active'
            )}
            key={index}
            style={stylex({ '--level': anchor.level - 2 })}
          >
            <a className="block truncate" href={anchor.to} title={anchor.text}>
              {anchor.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
