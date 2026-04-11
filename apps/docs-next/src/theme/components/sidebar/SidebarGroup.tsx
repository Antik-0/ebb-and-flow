import type { MenuItem } from '../../types'
import { Icon } from '../../icons'
import { SidebarItem } from './SidebarItem'

interface SidebarGroupProps {
  item: MenuItem
}

export function SidebarGroup({ item }: SidebarGroupProps) {
  const isGrouped = !!item.grouped

  return (
    <section className="py-3" data-role="group">
      {isGrouped ? (
        <>
          <div className="mb-2 flex px-2">
            {item.icon && (
              <Icon
                className="mr-2 flex h-8 text-18px text-brand"
                icon={item.icon}
              />
            )}
            <span className="font-700 text-14px text-muted-foreground leading-8">
              {item.text}
            </span>
          </div>
          {item.items?.map(subItem => (
            <section className="py-1" key={subItem.id}>
              <SidebarItem item={subItem} level={1} />
            </section>
          ))}
        </>
      ) : (
        <SidebarItem item={item} level={1} />
      )}
    </section>
  )
}
