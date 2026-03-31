import type { MenuItem } from '../../types'
import { stylex } from '#/utils'
import { useMenuNodeIsActive } from '../../controller/menus'
import { ChevronRight, Icon } from '../../icons'
import { Accordion, AccordionContent, AccordionTrigger } from '../Accordion'
import { EbbLink } from '../Link'

interface SidebarItemProps {
  item: MenuItem
  level?: number
}

export function SidebarItem(props: SidebarItemProps) {
  const { item, level = 1 } = props

  const isActive = useMenuNodeIsActive(item.index)
  const collapsed = item.collapsed ?? true
  const collapsiable = Array.isArray(item.items) && item.items.length

  if (collapsiable) {
    return (
      <Accordion defaultValue={collapsed}>
        <AccordionTrigger>
          <button
            className="sidebar-item__button"
            data-active={isActive}
            type="button"
          >
            {item.icon && (
              <Icon className="text-brand mr-2 h-8" icon={item.icon} />
            )}
            <span
              className="text-sm text-accent-foreground leading-8 font-700 flex-1 text-nowrap truncate"
              data-role="text"
            >
              {item.text}
            </span>
            <span className="text-4.5 text-muted-foreground flex size-6 flex-center">
              <ChevronRight className="transition-transform duration-300" />
            </span>
          </button>
        </AccordionTrigger>
        <AccordionContent style={stylex({ '--level': level })}>
          {item.items?.map((subItem, index) => (
            <SidebarItem item={subItem} key={index} level={level + 1} />
          ))}
        </AccordionContent>
      </Accordion>
    )
  }

  return (
    <li className="sidebar-item" data-active={isActive} data-role="route">
      <EbbLink
        className="flex gap-2 truncate transition-transform duration-300 items-center"
        href={item.link}
      >
        {item.icon && <Icon className="text-brand" icon={item.icon} />}
        <span
          className="text-sm text-muted-foreground leading-8 flex-1 transition-color duration-300 hover:text-brand-2"
          data-role="text"
        >
          {item.text}
        </span>
      </EbbLink>
    </li>
  )
}
