import type { WithHTMLProps } from '../types'
import { clsx } from '@repo/utils'
import { withVars } from '#/utils'

interface Props extends WithHTMLProps {
  avatar: string
}

export function CubeAvatar(props: Props) {
  const { avatar, className, style, ...restProps } = props

  return (
    <div
      className={clsx('cube-avatar', className)}
      style={style}
      {...restProps}
    >
      <div
        className={clsx('cube', className)}
        style={withVars({ '--avatar': `url(${avatar})` })}
      >
        <div className="cube-face" data-state="front"></div>
        <div className="cube-face" data-state="back"></div>
        <div className="cube-face" data-state="top"></div>
        <div className="cube-face" data-state="bottom"></div>
        <div className="cube-face" data-state="left"></div>
        <div className="cube-face" data-state="right"></div>
      </div>
    </div>
  )
}
