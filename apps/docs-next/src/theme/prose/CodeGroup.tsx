'use client'
import type { PropsWithChildren } from 'react'
import { clsx } from '@repo/utils'
import { useState } from 'react'
import { LogoIconRender } from '../icons'

interface TabItem {
  text: string
  icon?: string
}

interface Props {
  tabs?: TabItem[]
}

export function CodeGroup(props: PropsWithChildren<Props>) {
  const { tabs = [], children } = props
  const [activeIndex, setActiveIndex] = useState(0)

  const contents = Array.isArray(children) ? children : [children]

  return (
    <div className="code-group rounded-2 relative overflow-hidden">
      <div className="p-2 bg-[--c-bg-code-title]/80 flex gap-1 items-center">
        {tabs.map((item, index) => (
          <button
            className={clsx(
              'text-muted-foreground px-2 py-1.5 rounded-md flex gap-1 transition-colors items-center',
              'cursor-pointer hover:text-accent-foreground hover:bg-[--c-bg-code-block]',
              'data-[active=true]:text-accent-foreground data-[active=true]:bg-[--c-bg-code-block]'
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
          style={{ display: activeIndex === index ? undefined : 'none' }}
        >
          {content}
        </div>
      ))}
    </div>
  )
}
