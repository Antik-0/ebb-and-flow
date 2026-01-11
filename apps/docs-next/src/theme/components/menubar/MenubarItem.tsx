import type { PropsWithChildren, ReactNode } from 'react'
import type { MenuItem } from '../../types'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { useMenubarCtx } from '../../controller/navbar'
import { Icon } from '../../icons'
import { EbbLink } from '../Link'

interface Props {
  item: MenuItem
  content: () => ReactNode
  onHover: () => void
}

export function MenubarItem(props: Props) {
  const { item, content, onHover } = props
  const { forwardContent } = useMenubarCtx()

  useEffect(() => {
    forwardContent(item, content)
  }, [])

  return (
    <motion.li
      className="cursor-pointer relative data-[active=true]:text-brand hover:text-brand"
      data-active={item.active}
      layout
      onPointerEnter={onHover}
      role="menuitem"
    >
      <MenubarItemLink
        className="px-4 py-2.5 flex items-center"
        link={item.link}
      >
        {item.icon && item.active && (
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
      </MenubarItemLink>
      {item.active && (
        <motion.span
          className="h-px inset-x-px absolute from-transparent to-transparent via-brand/70 bg-linear-to-r -bottom-px"
          layout-id="menuitem-line"
        />
      )}
    </motion.li>
  )
}

function MenubarItemLink(
  props: PropsWithChildren<{ className?: string; link?: string }>
) {
  const { className, link, children } = props
  if (link) {
    return (
      <EbbLink className={className} href={link}>
        {children}
      </EbbLink>
    )
  }
  return <span className={className}>{children}</span>
}
