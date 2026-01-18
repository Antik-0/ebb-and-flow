import type { SVGProps } from 'react'
import { stylex } from '#/utils'

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
        strokeDasharray="16"
        strokeDashoffset="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path className="menu-line" d="M5 5h14" />
        <path
          className="menu-line"
          d="M5 12h14"
          style={stylex({ '--delay': '0.2s' })}
        />
        <path
          className="menu-line"
          d="M5 19h14"
          style={stylex({ '--delay': '0.4s' })}
        />
      </g>
    </svg>
  )
}
