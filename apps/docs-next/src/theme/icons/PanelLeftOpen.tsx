import type { SVGProps } from 'react'

export default function PanelLeftOpen(props: SVGProps<SVGSVGElement>) {
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
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <rect height="18" rx="2" width="18" x="3" y="3" />
        <path d="M9 3v18m5-12l3 3l-3 3" />
      </g>
    </svg>
  )
}
