'use client'
import { useState } from 'react'

export function SvgSpinner() {
  return (
    <div className="flex h-60 flex-center">
      <svg height="200" viewBox="-200 -200 400 400" width="200">
        <circle
          className="svg-spinner"
          cx="0"
          cy="0"
          fill="none"
          r="100"
          stroke="#59AFFF"
          strokeDasharray="1 314"
          strokeDashoffset="0"
          strokeLinecap="round"
          strokeWidth="24"
        />
      </svg>
    </div>
  )
}

export function ColorfulBorder() {
  return (
    <div className="flex h-60 flex-center">
      <div className="border-container">
        <div className="colorful-border"></div>
      </div>
    </div>
  )
}

export function GridMotion() {
  return (
    <div className="flex flex-center">
      <div className="grid-view">
        <div className="grid-stage">
          <div className="grid-flat"></div>
        </div>
      </div>
    </div>
  )
}

export function PlayonMotion() {
  return (
    <div className="flex h-60 flex-center">
      <svg
        height="1em"
        style={{ fontSize: '128px', color: 'oklch(0.645 0.246 16.439)' }}
        viewBox="0 0 32 32"
        width="1em"
      >
        <g stroke="currentColor" strokeLinecap="round" strokeWidth="6">
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

export function SvgLoading() {
  const defaultValue = 10
  const [scrollValue, setScrollValue] = useState(defaultValue)

  // 用滑块来模拟移动端下拉
  const scrollValueMax = 120
  const maxValue = 160

  // dashValue 至少要比 svg 的圆周大
  const dashValue = 100
  // 设置默认偏移量为 dashValue 完全隐藏圆弧轨迹
  const [dashoffset, setDashoffset] = useState(dashValue - defaultValue)
  // 设置最小偏移量，达到不显示完整的圆弧效果
  const dashoffsetMin = 40

  // 旋转角度
  const [rotateValue, setRotateValue] = useState(0)
  // 转动 3/4周
  const rotateValueMax = 270

  // 透明度
  const [opacitValue, setOpacitValue] = useState(0.4)

  const [loading, setLoading] = useState(false)

  function onInput(event: any) {
    const target = event.target as HTMLInputElement
    const scrollVal = Number(target.value)
    const value = Math.min(scrollVal, scrollValueMax)

    const percentage = value / scrollValueMax

    setDashoffset(
      Math.floor(Math.max(dashoffsetMin, dashValue - dashValue * percentage))
    )
    setRotateValue(rotateValueMax * percentage)
    // 0.4是最低的透明度
    setOpacitValue((1 - 0.4) * percentage + 0.4)

    setScrollValue(scrollVal)
    setLoading(scrollVal === maxValue)
  }

  return (
    <div className="flex h-60 flex-center">
      <div className="flex-col gap-4 flex-center">
        <div className="text-zinc text-center">
          <input
            max={maxValue}
            min="0"
            name="range"
            onInput={onInput}
            type="range"
            value={scrollValue}
          />
          <div>
            <label htmlFor="range">当前值: {scrollValue}</label>
          </div>
          <div>最大滚动值: {scrollValueMax}</div>
        </div>

        <svg
          className="svg-loading"
          data-loading={loading}
          fill="none"
          height="1em"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 32 32"
          width="1em"
        >
          <g
            opacity={opacitValue}
            style={{ transformOrigin: '16px 16px' }}
            transform={`rotate(${rotateValue})`}
          >
            <circle
              cx="16"
              cy="16"
              r="12"
              strokeDasharray="100"
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              style={{ transformOrigin: '16px 16px' }}
              transform="rotate(-45)"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
