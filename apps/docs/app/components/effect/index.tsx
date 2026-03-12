import './style.css'

export function SvgSpinner() {
  return (
    <div class="flex h-60 flex-center">
      <svg height="200" viewBox="-200 -200 400 400" width="200">
        <circle
          class="svg-spinner"
          cx="0"
          cy="0"
          fill="none"
          r="100"
          stroke="#59AFFF"
          stroke-dasharray="1 314"
          stroke-dashoffset="0"
          stroke-linecap="round"
          stroke-width="24"
        />
      </svg>
    </div>
  )
}

export function ColorfulBorder() {
  return (
    <div class="flex h-60 flex-center">
      <div class="border-container">
        <div class="colorful-border"></div>
      </div>
    </div>
  )
}

export function GridMotion() {
  return (
    <div class="flex flex-center">
      <div class="grid-view">
        <div class="grid-stage">
          <div class="grid-flat"></div>
        </div>
      </div>
    </div>
  )
}

export function PlayonMotion() {
  return (
    <div class="flex h-60 flex-center">
      <svg
        height="1em"
        style={{ fontSize: '128px', color: 'oklch(0.645 0.246 16.439)' }}
        viewBox="0 0 32 32"
        width="1em"
      >
        <g stroke="currentColor" stroke-linecap="round" stroke-width="6">
          <line x1="7" x2="7" y1="10" y2="26">
            <animate
              attributeName="y1"
              dur="0.8s"
              repeatCount="indefinite"
              values="10;20;10"
            ></animate>
          </line>
          <line x1="16" x2="16" y1="6" y2="26">
            <animate
              attributeName="y1"
              dur="0.8s"
              repeatCount="indefinite"
              values="18;6;18"
            ></animate>
          </line>
          <line x1="25" x2="25" y1="8" y2="26">
            <animate
              attributeName="y1"
              dur="0.8s"
              repeatCount="indefinite"
              values="8;20;8"
            ></animate>
          </line>
        </g>
      </svg>
    </div>
  )
}
