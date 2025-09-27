import { nextTick, onBeforeUnmount, onMounted, shallowRef } from 'vue'

interface CodingConfig {
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
  isCycle?: boolean
}

export function useCodingMotion(codes: string[], config: CodingConfig = {}) {
  const {
    speedGap = 40,
    pauseGap = 4000,
    prefix = '[',
    suffix = ']',
    placeholder = '.',
    isCycle = true
  } = config ?? {}
  const maxLength = config.maxLength ?? Math.max(...codes.map(s => s.length))

  let raf: number
  let isAnimating = true
  let lastAnimationTime: number

  const buffer = Array.from<string>({ length }).fill(placeholder)

  // 双指针 - 滑动窗口
  let p1 = 0
  let p2 = 0
  // p2 指针滑动方向
  let vector = 1
  // 当前动画的字符串
  let currCode = codes[0]!

  const coding = shallowRef(
    `${prefix}${placeholder.repeat(maxLength)}${suffix}`
  )

  function animationFrame(timestamp: DOMHighResTimeStamp) {
    if (!lastAnimationTime) {
      lastAnimationTime = timestamp
    }

    if (timestamp - lastAnimationTime > pauseGap) {
      isAnimating = true
    }

    if (isAnimating && timestamp - lastAnimationTime > speedGap) {
      buffer[p2] = vector === 1 ? currCode[p2]! : placeholder
      coding.value = `${prefix}${buffer.join('')}${suffix}`
      p2 += vector

      if (p2 === -1) {
        // 左边界
        p2 = 0
        vector = 1
        p1 = (p1 + 1) % codes.length
        currCode = codes[p1]!
      }

      if (p2 === currCode.length) {
        // 右边界
        p2 = currCode.length - 1
        vector = -1
        isAnimating = false

        if (p1 === codes.length - 1 && !isCycle) {
          return window.cancelAnimationFrame(raf)
        }
      }

      lastAnimationTime = timestamp
    }

    raf = window.requestAnimationFrame(animationFrame)
  }

  onMounted(async () => {
    if (codes.length === 0) return
    await nextTick()
    raf = window.requestAnimationFrame(animationFrame)
  })

  onBeforeUnmount(() => {
    window.cancelAnimationFrame(raf)
  })

  return { coding }
}
