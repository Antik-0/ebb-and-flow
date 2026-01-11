import type { SidebarMenuItem } from '../../types'
import { Icon } from '../../icons'
import { SidebarItem } from './SidebarItem'

interface SidebarGroupProps {
  item: SidebarMenuItem
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
          {item.items?.map((subItem, index) => (
            <section className="py-1" key={index}>
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
