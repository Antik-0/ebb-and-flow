import type { PropsWithChildren } from 'react'
import type { MenuItem } from '../../types'
import { useEffect, useRef, useState } from 'react'
import { useMenuNodeIsActive } from '../../controller/menus'
import { ChevronRight, Icon } from '../../icons'
import { EbbLink } from '../Link'

interface SidebarItemProps {
  item: MenuItem
  level?: number
}

export function SidebarItem(props: SidebarItemProps) {
  const { item, level = 1 } = props

  const isActive = useMenuNodeIsActive(item.id)
  const collapsible = Array.isArray(item.items) && item.items.length

  if (collapsible) {
    return (
      <SidebarItemCollapsible
        defaultCollapsed={item.collapsed}
        icon={item.icon}
        isActive={isActive}
        level={level}
        text={item.text}
      >
        {item.items!.map((subItem, index) => (
          <SidebarItem item={subItem} key={index} level={level + 1} />
        ))}
      </SidebarItemCollapsible>
    )
  }

  return (
    <div className="sidebar-item" data-active={isActive} data-role="route">
      <EbbLink className="flex gap-2 truncate items-center" href={item.link!}>
        {item.icon && <Icon className="text-brand" icon={item.icon} />}
        <span
          className="text-sm text-muted-foreground leading-8 flex-1 transition-color duration-250 hover:text-brand-2"
          data-role="title"
        >
          {item.text}
        </span>
      </EbbLink>
    </div>
  )
}

interface CollapsibleProps {
  defaultCollapsed?: boolean
  isActive: boolean
  text: string
  icon?: string
  level: number
}

function SidebarItemCollapsible(props: PropsWithChildren<CollapsibleProps>) {
  const { text, level, isActive, icon, children } = props
  const defaultCollapsed = props.defaultCollapsed ?? true

  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const viewRef = useRef<HTMLDivElement | null>(null)

  function toggle() {
    const element = viewRef.current!
    if (collapsed) {
      setCollapsed(false)
      element.style.removeProperty('display')
      element.style.height = element.scrollHeight + 'px'
    } else {
      setCollapsed(true)
      element.style.height = '0'
    }
  }

  function onTransitionEnd(event: any) {
    event.stopPropagation()
    if (collapsed) {
      const element = viewRef.current!
      element.style.setProperty('display', 'none')
    }
  }

  useEffect(() => {
    const element = viewRef.current
    if (element && collapsed) {
      element.style.display = 'none'
      element.style.height = '0'
    }
  }, [])

  return (
    <>
      <button
        aria-expanded={!collapsed}
        className="sidebar-item__button"
        data-active={isActive}
        onClick={toggle}
        type="button"
      >
        {icon && <Icon className="text-brand mr-2 h-8" icon={icon} />}
        <span
          className="text-sm text-accent-foreground leading-8 font-700 flex-1 text-nowrap truncate"
          data-role="button-title"
        >
          {text}
        </span>
        <span className="text-4.5 text-muted-foreground flex size-6 flex-center">
          <ChevronRight className="transition-transform duration-250" />
        </span>
      </button>
      <div
        className="pl-5 transition-height duration-250 ease overflow-hidden"
        data-level={level}
        onTransitionEnd={onTransitionEnd}
        ref={viewRef}
      >
        {children}
      </div>
    </>
  )
}
