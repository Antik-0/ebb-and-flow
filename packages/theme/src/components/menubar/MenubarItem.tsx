import type { MenuItem } from '#/types'
import { motion } from 'motion-v'
import { defineComponent } from 'vue'
import { useMenuNodeIsActive } from '#/controller/menus'
import { useMenubar } from '#/controller/navbar'
import { Icon } from '#/icons'
import { Link } from '../Link.tsx'

export const MenubarItem = defineComponent<{
  index: number
  item: MenuItem
}>(
  props => {
    const { onMenuItemHover } = useMenubar()
    const isActive = useMenuNodeIsActive(props.item.index)

    return () => {
      const { index, item } = props
      const active = isActive.value

      return (
        <motion.li
          class="relative cursor-pointer hover:text-brand data-[active=true]:text-brand"
          data-active={active}
          data-role="menuitem"
          layout
          onPointerenter={() => onMenuItemHover(index)}
        >
          <Link class="flex items-center px-4 py-2.5" href={item.link}>
            {item.icon && active && (
              <motion.span
                class="mr-1 inline-flex flex-center text-4"
                layoutId="menuitem-icon"
              >
                <Icon icon={item.icon} />
              </motion.span>
            )}
            <motion.span class="text-sm" layout>
              {item.text}
            </motion.span>
          </Link>
          {active && (
            <motion.span
              class="absolute inset-x-px -bottom-px h-px bg-linear-to-r from-transparent via-brand/70 to-transparent"
              layoutId="menuitem-line"
            />
          )}
        </motion.li>
      )
    }
  },
  { name: 'MenubarItem', props: ['index', 'item'] }
)
