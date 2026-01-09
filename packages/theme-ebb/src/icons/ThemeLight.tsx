import type { SVGProps } from 'react'
import { withVars } from '#/utils'

export default function ThemeLight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="sun"
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
        <path
          className="sun-light"
          d="M12 21v1M21 12h1M12 3v-1M3 12h-1"
          stroke-dasharray="2"
          stroke-dashoffset="2"
          style={withVars({ '--delay': '0.6s' })}
        />
        <path
          className="sun-light"
          d="M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
          stroke-dasharray="2"
          stroke-dashoffset="2"
          style={withVars({ '--delay': '0.8s' })}
        />
      </g>
      <mask id="SVGu6kfobeu">
        <circle cx="12" cy="12" fill="#fff" r="12" />
        <circle cx="18" cy="6" fill="#fff" r="12">
          <animate attributeName="cx" dur="0.4s" fill="freeze" values="18;22" />
          <animate attributeName="cy" dur="0.4s" fill="freeze" values="6;2" />
          <animate attributeName="r" dur="0.4s" fill="freeze" values="12;3" />
        </circle>
        <circle cx="18" cy="6" r="10">
          <animate attributeName="cx" dur="0.4s" fill="freeze" values="18;22" />
          <animate attributeName="cy" dur="0.4s" fill="freeze" values="6;2" />
          <animate attributeName="r" dur="0.4s" fill="freeze" values="10;1" />
        </circle>
      </mask>
      <circle
        className="sun-body"
        cx="12"
        cy="12"
        fill="currentColor"
        mask="url(#SVGu6kfobeu)"
        r="10"
      />
    </svg>
  )
}
