import type { WithHTMLProps } from '../types'
import { clsx } from '@repo/utils'

export function GlassMask(props: WithHTMLProps) {
  const { className, ...restProps } = props
  return (
    <div className={clsx('glass-mask', className)} {...restProps}>
      <div className="glass-mask__image"></div>
    </div>
  )
}
