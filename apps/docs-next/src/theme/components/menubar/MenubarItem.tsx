import type { MenuItem } from '../../types'
import { motion } from 'motion/react'
import { useMenuNodeIsActive } from '../../controller/menus'
import { useMenubar } from '../../controller/navbar'
import { Icon } from '../../icons'
import { EbbLink } from '../Link'

interface Props {
  item: MenuItem
  index: number
}

export function MenubarItem(props: Props) {
  const { item, index } = props
  const { onMenuItemHover } = useMenubar()
  const isActive = useMenuNodeIsActive(item.id)

  return (
    <motion.li
      className="cursor-pointer relative data-[active=true]:text-brand hover:text-brand"
      data-active={isActive}
      data-role="menuitem"
      layout
      onPointerEnter={() => onMenuItemHover(index)}
    >
      <EbbLink className="px-4 py-2.5 flex items-center" href={item.link}>
        {item.icon && isActive && (
          <motion.span
            className="text-4 mr-1 inline-flex flex-center"
            layout-id="menuitem-icon"
          >
            <Icon icon={item.icon} />
          </motion.span>
        )}
        <motion.span className="text-sm" layout>
          {item.text}
        </motion.span>
      </EbbLink>
      {isActive && (
        <motion.span
          className="h-px inset-x-px absolute from-transparent to-transparent via-brand/70 bg-linear-to-r -bottom-px"
          layout-id="menuitem-line"
        />
      )}
    </motion.li>
  )
}
