'use client'
import type { PropsWithChildren } from 'react'
import { clsx } from '@repo/utils'
import { useState } from 'react'
import { stylex } from '#/utils'
import { LogoIconRender } from '../icons'

interface Props {
  tabs?: TabItem[]
}

interface TabItem {
  text: string
  icon?: string
}

export function CodeGroup(props: PropsWithChildren<Props>) {
  const { tabs = [], children } = props
  const [activeIndex, setActiveIndex] = useState(0)

  const contents = Array.isArray(children) ? children : [children]

  return (
    <div className="relative my-4 overflow-hidden rounded-2">
      <div className="flex items-center gap-1 bg-[--c-bg-code-title]/80 p-2">
        {tabs.map((item, index) => (
          <button
            className={clsx(
              'flex items-center gap-1 rounded-md px-2 py-1.5 text-muted-foreground transition-colors',
              'cursor-pointer hover:bg-[--c-bg-code-block] hover:text-accent-foreground',
              'data-[active=true]:bg-[--c-bg-code-block] data-[active=true]:text-accent-foreground'
            )}
            data-active={activeIndex === index}
            key={index}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            {item.icon && (
              <LogoIconRender className="size-4" logo={item.icon} />
            )}
            <span className="text-sm">{item.text}</span>
          </button>
        ))}
      </div>
      {contents.map((content, index) => (
        <div
          key={index}
          style={stylex({ display: activeIndex !== index && 'none' })}
        >
          {content}
        </div>
      ))}
    </div>
  )
}
