import { clsx } from '@repo/utils'
import { useEffect, useRef, useState } from 'react'
import { useAnimationFrame } from '#/hooks'

interface Props {
  /**
   * 技能列表
   */
  codes?: string[]
  /**
   * 是否暂停
   */
  paused?: boolean
  /**
   * coding 速度间隔
   */
  speedGap?: number
  /**
   * coding 暂停间隔
   */
  pauseGap?: number
  /**
   * 字符最大长度
   */
  maxLength?: number
  /**
   * 前缀
   */
  prefix?: string
  /**
   * 后缀
   */
  suffix?: string
  /**
   * 占位符
   */
  placeholder?: string
  /**
   * 是否循环
   */
  cycle?: boolean
}

const spinners = ['|', '/', '-', '\\', '|', '/', '-', '\\']

export function CodeMotion(props: Props) {
  const {
    codes = [],
    paused = false,
    speedGap = 40,
    pauseGap = 4000,
    prefix = '[',
    suffix = ']',
    placeholder = '.',
    cycle = false
  } = props

  const [coding, setCoding] = useState('')
  const [spinner, setSpinner] = useState('|')
  const spinnerIndex = useRef(0)

  useAnimationFrame(() => {
    const index = (spinnerIndex.current + 1) % spinners.length
    spinnerIndex.current = index
    setSpinner(spinners[index]!)
  }, 200)

  const controller = useRef<MotionController | null>(null)

  useEffect(() => {
    const maxLength =
      props.maxLength ?? Math.max(0, ...codes.map(s => s.length))
    setCoding(`${prefix}${placeholder.repeat(maxLength)}${suffix}`)

    const { start, stop } = createAnimationFrame(
      {
        codes,
        speedGap,
        pauseGap,
        maxLength,
        prefix,
        suffix,
        placeholder,
        cycle
      },
      setCoding
    )

    controller.current = { start, stop }

    if (!paused) start()
    return stop
  }, [])

  useEffect(() => {
    if (paused) {
      controller.current?.start()
    } else {
      controller.current?.stop?.()
    }
  }, [paused])

  return (
    <span
      className={clsx(
        'px-2 rounded-2 inline-flex contain-content items-center',
        'text-brand-2 font-mono bg-zinc-600/40',
        'transition-opacity duration-600 data-[paused=true]:opacity-20'
      )}
      data-paused={paused}
    >
      {coding}
      <span className="text-white">{spinner}</span>
    </span>
  )
}

interface MotionController {
  start: () => void
  stop: () => void
}

function createAnimationFrame(
  props: Required<Omit<Props, 'paused'>>,
  update: (value: string) => void
): MotionController {
  const {
    codes,
    speedGap,
    pauseGap,
    maxLength,
    prefix,
    suffix,
    placeholder,
    cycle
  } = props

  const buffer = Array.from<string>({ length: maxLength }).fill(placeholder)

  let raf: number | undefined
  let isAnimating = true
  let lastAnimationTime: number | undefined

  let p1 = 0 // 当前显示的字符位置
  let p2 = 0 // 当前字符的遍历位置
  let vector = 1 // 当前字符的遍历方向
  let currCode = codes[p1]!

  function animationFrame(timestamp: DOMHighResTimeStamp) {
    if (!lastAnimationTime) {
      lastAnimationTime = timestamp
    }

    if (timestamp - lastAnimationTime > pauseGap) {
      isAnimating = true
    }

    if (isAnimating && timestamp - lastAnimationTime > speedGap) {
      buffer[p2] = vector === 1 ? currCode[p2]! : placeholder
      update(`${prefix}${buffer.join('')}${suffix}`)
      p2 += vector

      // 左边界
      if (p2 === -1) {
        p2 = 0
        vector = 1
        p1 = (p1 + 1) % codes.length
        currCode = codes[p1]!
      }

      // 右边界
      if (p2 === currCode.length) {
        p2 = currCode.length - 1
        vector = -1
        isAnimating = false

        if (p1 === codes.length - 1 && !cycle) {
          return stop()
        }
      }

      lastAnimationTime = timestamp
    }

    raf = window.requestAnimationFrame(animationFrame)
  }

  const start = () => {
    if (!raf && codes.length) {
      raf = window.requestAnimationFrame(animationFrame)
    }
  }

  const stop = () => {
    if (raf) {
      window.cancelAnimationFrame(raf)
      raf = undefined
    }
  }

  return { start, stop }
}
