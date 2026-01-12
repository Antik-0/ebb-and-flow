import type { MenuItem } from '../../types'
import { Icon } from '../../icons'
import { SidebarItem } from './SidebarItem'

interface SidebarGroupProps {
  item: MenuItem
}

export function SidebarGroup({ item }: SidebarGroupProps) {
  const isGrouped = !!item.grouped

  return (
    <section className="sidebar-group" data-role="group">
      {isGrouped ? (
        <>
          <div className="mb-2 px-2 flex">
            {item.icon && (
              <Icon
                className="text-18px text-brand mr-2 flex h-8"
                icon={item.icon}
              />
            )}
            <span className="text-14px text-muted-foreground leading-8 font-700">
              {item.text}
            </span>
          </div>
          {item.items?.map(subItem => (
            <section className="py-1" key={subItem.id}>
              <SidebarItem item={subItem} />
            </section>
          ))}
        </>
      ) : (
        <SidebarItem item={item} />
      )}
    </section>
  )
}
