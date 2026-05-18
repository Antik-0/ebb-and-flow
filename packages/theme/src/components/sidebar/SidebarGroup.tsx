import type { MenuItem } from '#/types'
import { Icon } from '#/icons'
import { SidebarItem } from './SidebarItem.tsx'

export function SidebarGroup(props: { item: MenuItem }) {
  const { item } = props
  const isGrouped = !!item.grouped

  if (!isGrouped) {
    return (
      <section class="py-3" data-role="group">
        <SidebarItem item={item} level={1} />
      </section>
    )
  }

  return (
    <section class="py-3" data-role="group">
      <div class="mb-2 flex px-2">
        {item.icon && (
          <Icon class="mr-2 flex h-8 text-18px text-brand" icon={item.icon} />
        )}
        <span class="font-700 text-14px text-muted-foreground leading-8">
          {item.text}
        </span>
      </div>
      {item.items?.map((subItem, index) => (
        <section class="py-1" key={index}>
          <SidebarItem item={subItem} level={1} />
        </section>
      ))}
    </section>
  )
}
