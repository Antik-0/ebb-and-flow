import type { SVGProps } from 'react'
import { withVars } from '#/utils'

export default function Menu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-dasharray="16"
        stroke-dashoffset="16"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path className="menu-line" d="M5 5h14" />
        <path
          className="menu-line"
          d="M5 12h14"
          style={withVars({ '--delay': '0.2s' })}
        />
        <path
          className="menu-line"
          d="M5 19h14"
          style={withVars({ '--delay': '0.4s' })}
        />
      </g>
    </svg>
  )
}
