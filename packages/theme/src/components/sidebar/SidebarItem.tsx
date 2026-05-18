import type { MenuItem } from '#/types'
import { computed, defineComponent } from 'vue'
import { Link } from '#/components/Link.tsx'
import { useMenuNodeIsActive } from '#/controller/menus'
import { ChevronRight, Icon } from '#/icons'
import { Accordion, AccordionContent, AccordionTrigger } from '../Accordion.tsx'

export const SidebarItem = defineComponent<{ item: MenuItem; level?: number }>(
  props => {
    const collapsed = props.item.collapsed ?? true
    const collapsiable = computed(() => {
      const item = props.item
      return Array.isArray(item.items) && item.items.length
    })

    const isActive = useMenuNodeIsActive(props.item.index)

    return () => {
      const { item, level = 1 } = props

      if (!collapsiable.value) {
        return (
          <div
            class="sidebar-item"
            data-active={isActive.value}
            data-role="route"
          >
            <Link
              class="flex items-center gap-2 truncate transition-transform duration-300"
              href={item.link}
            >
              {item.icon && <Icon class="text-brand" icon={item.icon} />}
              <span
                class="flex-1 text-muted-foreground text-sm leading-8 transition-color duration-300 hover:text-brand-2"
                data-role="text"
              >
                {item.text}
              </span>
            </Link>
          </div>
        )
      }

      return (
        <Accordion default-value={collapsed}>
          <AccordionTrigger>
            <button
              class="sidebar-item__button"
              data-active={isActive.value}
              type="button"
            >
              {item.icon && (
                <Icon class="mr-2 h-8 text-brand" icon={item.icon} />
              )}
              <span
                class="flex-1 truncate text-nowrap font-700 text-accent-foreground text-sm leading-8"
                data-role="text"
              >
                {item.text}
              </span>
              <span class="flex size-6 flex-center text-4.5 text-muted-foreground">
                <ChevronRight class="transition-transform duration-300" />
              </span>
            </button>
          </AccordionTrigger>
          <AccordionContent style={{ '--level': level }}>
            {item.items?.map((subItem, index) => (
              <SidebarItem item={subItem} key={index} level={level + 1} />
            ))}
          </AccordionContent>
        </Accordion>
      )
    }
  },
  { name: 'SidebarItem', props: ['item', 'level'] }
)
