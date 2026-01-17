'use client'
import type { FormEvent } from 'react'
import { clsx } from '@repo/utils'
import { useState } from 'react'

const defaultValue = 10

// 用滑块来模拟移动端下拉
const scrollValueMax = 120
const maxValue = 160

// dashValue 至少要比 svg 的圆周大
const dashValue = 100
// 设置最小偏移量，达到不显示完整的圆弧效果
const dashoffsetMin = 40

// 转动 3/4周
const rotateValueMax = 270

export function SVGLoading() {
  // 用滑块来模拟移动端下拉
  const [scrollValue, setScrollValue] = useState(defaultValue)

  // 设置默认偏移量为 dashValue 完全隐藏圆弧轨迹
  const [dashoffset, setDashoffset] = useState(dashValue - defaultValue)

  // 旋转角度
  const [rotateValue, setRotateValue] = useState(0)

  // 透明度
  const [opacitValue, setOpacitValue] = useState(0.4)

  const [loading, setLoading] = useState(false)

  function onInput(event: FormEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement
    const scrollVal = Number(target.value)
    const value = Math.min(scrollVal, scrollValueMax)

    const percentage = value / scrollValueMax

    setScrollValue(scrollVal)
    setDashoffset(
      Math.floor(Math.max(dashoffsetMin, dashValue - dashValue * percentage))
    )
    setRotateValue(rotateValueMax * percentage)
    // 0.4是最低的透明度
    setOpacitValue((1 - 0.4) * percentage + 0.4)

    // 用最大值来模拟下拉松开情景，触发loading
    setLoading(scrollVal === maxValue)
  }

  return (
    <div className="flex h-60 flex-center">
      <div className="flex-col gap-4 flex-center">
        <div className="text-zinc text-center">
          <input
            max={maxValue}
            min={0}
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

        <div className=""></div>

        <svg
          className={clsx(
            'text-[96px] text-violet px-[10px] rounded-full bg-white',
            'shadow-[0_0_10px_4px] shadow-violet',
            'data-[loading=true]:animate-spin'
          )}
          data-loading={loading}
          fill="none"
          height="1em"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 32 32"
          width="1em"
        >
          <g opacity={opacitValue} transform={`rotate(${rotateValue} 16 16)`}>
            <circle
              cx="16"
              cy="16"
              r="12"
              strokeDasharray="100"
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              transform="rotate(-45 16 16)"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
