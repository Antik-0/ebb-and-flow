import { useRef } from 'react'
import { stylex } from '#/utils'
import { useScroll } from '../hooks'

export function ScrollIndicator() {
  const { progress } = useScroll()
  const pathLength = useRef(2 * Math.PI * 12)
  const dashoffset = pathLength.current * (1 - progress)

  return (
    <svg
      height="1em"
      style={stylex({
        rotate: '-90deg',
        transition: 'stroke-offset 600ms ease-in'
      })}
      viewBox="0 0 32 32"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="16"
        cy="16"
        fill="none"
        r="12"
        rotate="-90deg"
        stroke="currentColor"
        strokeDasharray={pathLength.current}
        strokeDashoffset={dashoffset}
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  )
}
