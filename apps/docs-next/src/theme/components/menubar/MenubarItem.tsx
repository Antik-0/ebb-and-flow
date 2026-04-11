import type { MenuItem } from '../../types'
import { motion } from 'motion/react'
import { useCallback } from 'react'
import { withViewTransition } from '#/utils'
import { useMenuNodeIsActive } from '../../controller/menus'
import { useMenubar } from '../../controller/navbar'
import { Icon } from '../../icons'
import { EbbLink } from '../Link'

interface Props {
  index: number
  item: MenuItem
}

export function MenubarItem(props: Props) {
  const { item, index } = props
  const { onMenuItemHover } = useMenubar()
  const isActive = useMenuNodeIsActive(item.index)

  const onNavigate = useCallback(() => {
    if (item.link === '/docs/archive') {
      withViewTransition('', '/archive')
    }
  }, [])

  return (
    <motion.li
      className="relative cursor-pointer hover:text-brand data-[active=true]:text-brand"
      data-active={isActive}
      data-role="menuitem"
      layout
      onPointerEnter={() => onMenuItemHover(index)}
    >
      <EbbLink
        className="flex items-center px-4 py-2.5"
        href={item.link}
        onNavigate={onNavigate}
      >
        {item.icon && isActive && (
          <motion.span
            className="mr-1 inline-flex flex-center text-4"
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
          className="absolute inset-x-px -bottom-px h-px bg-linear-to-r from-transparent via-brand/70 to-transparent"
          layout-id="menuitem-line"
        />
      )}
    </motion.li>
  )
}
