<script setup lang='ts'>
import { useMotionFrame } from '@repo/utils/hooks'
import { nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

const props = defineProps<{
  /**
   * 技能列表
   */
  skills?: string[]
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
}>()

const {
  skills = [],
  speedGap = 40,
  pauseGap = 4000,
  prefix = '[',
  suffix = ']',
  placeholder = '.',
  cycle = true
} = props

const maxLength = props.maxLength ?? Math.max(...skills.map(s => s.length))
const buffer = Array.from<string>({ length: maxLength }).fill(placeholder)

const coding = shallowRef(`${prefix}${placeholder.repeat(maxLength)}${suffix}`)

let raf: number
let isAnimating = true
let lastAnimationTime: number

let p1 = 0 // 当前显示的字符位置
let p2 = 0 // 当前字符的遍历位置
let vector = 1 // 当前字符的遍历方向
let currCode = skills[p1]!

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
      p1 = (p1 + 1) % skills.length
      currCode = skills[p1]!
    }

    // 右边界
    if (p2 === currCode.length) {
      p2 = currCode.length - 1
      vector = -1
      isAnimating = false

      if (p1 === skills.length - 1 && !cycle) {
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

onMounted(async () => {
  if (skills.length === 0 || props.paused) return
  await nextTick()
  raf = window.requestAnimationFrame(animationFrame)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(raf)
})

const spinner = shallowRef('|')
const spinners = ['|', '/', '-', '\\', '|', '/', '-', '\\']
let spinnerIndex = 0

useMotionFrame(() => {
  spinnerIndex = (spinnerIndex + 1) % spinners.length
  spinner.value = spinners[spinnerIndex]!
}, 200)
</script>

<template>
  <span
    :class="[
      'contain-content inline-flex items-center px-2 rounded-2',
      'font-mono text-brand-3 bg-zinc-600/40',
      'transition-opacity duration-600 data-[paused=true]:opacity-20'
    ]"
    :data-paused="paused"
  >
    {{ coding }}
    <span class="text-white">{{ spinner }}</span>
  </span>
</template>
