'use client'
import type { PropsWithChildren, ReactNode } from 'react'
import { clsx } from '@repo/utils'
import { useMemo, useState } from 'react'
import { LogoIconRender } from '../icons'

export function CodeGroup({ children }: PropsWithChildren) {
  const [activeIndex, setActiveIndex] = useState(0)

  const codeItems = useMemo(() => resolvePreNode(children), [children])

  return (
    <div className="code-group rounded-2 relative">
      <div className="p-2 bg-[--c-bg-code-title]/80 flex gap-1 items-center">
        {codeItems.map((item, index) => (
          <button
            className={clsx(
              'text-muted-foreground px-2 py-1.5 rounded-md flex gap-1 transition-colors items-center',
              'hover:(text-accent-foreground bg-[--c-bg-code-block])',
              `data-[active='true']:text-accent-foreground data-[active='true']:bg-[--c-bg-code-block]`
            )}
            data-active={activeIndex === index}
            key={index}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            {item.logo && (
              <LogoIconRender className="size-4" logo={item.logo} />
            )}
            <span className="text-sm">{item.title}</span>
          </button>
        ))}
      </div>
      {codeItems.map((item, index) => item.children)}
    </div>
  )
}

interface CodeItem {
  title?: string
  logo?: string
  children: ReactNode
}

interface CodeRecord {
  code?: string
  lines?: string
  filename?: string
  language?: string
}

function resolvePreNode(children: ReactNode) {
  if (!Array.isArray(children)) {
    children = [children]
  }
  const res: CodeItem[] = []
  for (const node of children) {
    const preNode = node.props.children as any
    const props = (preNode?.props ?? {}) as CodeRecord
    res.push({
      title: props.filename || props.language,
      logo: props.language,
      children: node
    })
  }
  return res
}
