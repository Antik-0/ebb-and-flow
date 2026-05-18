import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch
} from 'vue'
import { useAnimationFrame } from '#/hooks'

const MotionConfig = {
  speedGap: 40,
  pauseGap: 4000,
  prefix: '[',
  suffix: ']',
  placeholder: '.'
}

export const CodeMotion = defineComponent<{
  codes: string[]
  paused?: boolean
  cycle?: boolean
}>(
  props => {
    const { codes, cycle = false } = props
    const { speedGap, pauseGap, prefix, suffix, placeholder } = MotionConfig

    const maxLength = Math.max(...codes.map(s => s.length))
    const buffer = Array.from<string>({ length: maxLength }).fill(placeholder)

    const coding = shallowRef(
      `${prefix}${placeholder.repeat(maxLength)}${suffix}`
    )

    let raf: number
    let isAnimating = true
    let lastAnimationTime: number

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
        coding.value = `${prefix}${buffer.join('')}${suffix}`
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
            return window.cancelAnimationFrame(raf)
          }
        }

        lastAnimationTime = timestamp
      }

      raf = window.requestAnimationFrame(animationFrame)
    }

    watch(
      () => props.paused,
      paused => {
        if (paused) {
          window.cancelAnimationFrame(raf)
        } else {
          raf = window.requestAnimationFrame(animationFrame)
        }
      }
    )

    onMounted(() => {
      if (codes.length === 0 || props.paused) return
      raf = window.requestAnimationFrame(animationFrame)
    })

    onBeforeUnmount(() => {
      window.cancelAnimationFrame(raf)
    })
    return () => (
      <span
        class={[
          'inline-flex items-center rounded-2 px-2 contain-content',
          'bg-zinc-600/40 font-mono text-brand-2',
          'transition-opacity duration-600 data-[paused=true]:opacity-20'
        ]}
        data-paused={props.paused}
      >
        {coding.value}
        <SpinnerMotion />
      </span>
    )
  },
  { name: 'CodeMotion', props: ['codes', 'paused', 'cycle'] }
)

const spinners = ['|', '/', '-', '\\', '|', '/', '-', '\\']

const SpinnerMotion = defineComponent(
  () => {
    const spinner = shallowRef('|')
    let spinnerIndex = 0
    useAnimationFrame(() => {
      spinnerIndex = (spinnerIndex + 1) % spinners.length
      spinner.value = spinners[spinnerIndex]!
    }, 200)

    return () => <span class="text-white">{spinner.value}</span>
  },
  { name: 'SpinnerMotion' }
)
