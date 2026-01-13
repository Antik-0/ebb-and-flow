import type { PropsWithChildren } from 'react'
import type { WithHTMLProps } from '../../types'
import { clsx } from '@repo/utils'
import { useSidebarControl } from '../../controller/sidebar'

export function SidebarTrigger(
  props: PropsWithChildren<WithHTMLProps<HTMLButtonElement>>
) {
  const { className, children, ...restProps } = props
  const { isOpen, toggle } = useSidebarControl()

  return (
    <button
      aria-checked={isOpen}
      aria-label="sidebar-button"
      className={clsx('flex cursor-pointer flex-center', className)}
      onClick={toggle}
      role="switch"
      type="button"
      {...restProps}
    >
      {children}
    </button>
  )
}
