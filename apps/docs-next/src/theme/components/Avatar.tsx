import type { WithHTMLProps } from '../types'
import { clsx } from '@repo/utils'
import Image from 'next/image'

interface Props extends WithHTMLProps<HTMLButtonElement> {
  avatar: string
}

export function EbbAvatar(props: Props) {
  const { avatar, className, ...restProps } = props

  return (
    <button
      aria-label="avatar"
      className={clsx(
        'cursor-pointer drop-shadow-sm drop-shadow-color-cyan-300',
        className
      )}
      type="button"
      {...restProps}
    >
      <div className="mask mask-squircle">
        <Image
          alt="site owner avatar"
          className="size-11"
          decoding="async"
          src={avatar}
        />
      </div>
    </button>
  )
}
