import type { WithHTMLProps } from '../types'
import { clsx } from '@repo/utils'
import Image from 'next/image'
import { stylex } from '#/utils'

interface AvatarProps extends WithHTMLProps<HTMLButtonElement> {
  avatar: string
}

export function Avatar(props: AvatarProps) {
  const { avatar, className, ...restProps } = props

  return (
    <button
      aria-label="avatar"
      className={clsx(
        'cursor-pointer drop-shadow-color-cyan-300 drop-shadow-sm',
        className
      )}
      type="button"
      {...restProps}
    >
      <div className="mask mask-squircle">
        <Image
          alt="site owner avatar"
          decoding="async"
          height={44}
          src={avatar}
          width={44}
        />
      </div>
    </button>
  )
}

interface MoonAvatarProps {
  avatar: string
}

export function MoonAvatar(props: MoonAvatarProps) {
  return (
    <div className="moon-avatar relative isolate size-50 cursor-pointer">
      <div className="absolute inset-0 z-20 overflow-hidden rounded-full">
        <Image
          alt="site owner avatar"
          className="transition-transform duration-600 ease-out"
          height={200}
          loading="eager"
          src={props.avatar}
          width={200}
        />
      </div>
      <div className="moon-bg"></div>
      <div className="moon-mask"></div>
    </div>
  )
}

interface CubeAvatarProps extends WithHTMLProps {
  avatar: string
}

export function CubeAvatar(props: CubeAvatarProps) {
  const { avatar, className, style, ...restProps } = props

  return (
    <div
      className={clsx('cube-avatar', className)}
      style={style}
      {...restProps}
    >
      <div
        className={clsx('cube', className)}
        style={stylex({ '--avatar': `url(${avatar})` })}
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

export function FlowingLight() {
  return (
    <div aria-hidden="true" className="flowing-light">
      <div
        className="flowing-light__line"
        style={stylex({ '--angle-to': '180deg' })}
      ></div>
      <div
        className="flowing-light__line"
        style={stylex({ '--angle-to': '-180deg' })}
      ></div>
    </div>
  )
}

export function GlassMask(props: WithHTMLProps) {
  const { className, ...restProps } = props
  return (
    <div
      aria-hidden="true"
      className={clsx('glass-mask', className)}
      {...restProps}
    >
      <div className="mask-image"></div>
    </div>
  )
}

const pathLength = Math.ceil(2 * Math.PI * 12)

export function ScrollIndicator() {
  return (
    <svg
      height="1em"
      style={stylex({ rotate: '-90deg' })}
      viewBox="0 0 32 32"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="scroll-indicator"
        cx="16"
        cy="16"
        fill="none"
        r="12"
        stroke="currentColor"
        strokeDasharray={pathLength}
        strokeLinecap="round"
        strokeWidth="3"
        style={stylex({
          '--value-from': pathLength,
          '--value-to': 0
        })}
      />
    </svg>
  )
}
