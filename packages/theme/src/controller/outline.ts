import type { OutlineAnchor } from '#/types'
import { computed, reactive } from 'vue'
import { createSharedState, useIntersectionObserver } from '#/hooks'
import { onPageMounted, usePage } from './layout'

let activeState: number[] = []
const activeRange = reactive({ start: -1, end: -1 })

export const useOutline = createSharedState(() => {
  const { page } = usePage()
  const anchors = computed(() => page.value?.toc ?? [])

  const { observe, clear } = useIntersectionObserver()

  function observeHeading() {
    const container = document.getElementById('content')
    if (!container) return

    const size = anchors.value.length
    activeState = Array.from<number>({ length: size }).fill(0)

    for (const [index, item] of anchors.value.entries()) {
      const target = container.querySelector(item.to)
      if (target) {
        target.setAttribute('data-index', index + '')
        observe(target, entry => {
          const index = Number(entry.target.getAttribute('data-index'))
          const isAcitve = entry.isIntersecting
          activeState[index] = isAcitve ? 1 : 0

          activeRange.start = activeState.indexOf(1)
          activeRange.end = activeState.lastIndexOf(1)
        })
      }
    }
  }

  function clearObserver() {
    clear()
    activeState.length = 0
    activeRange.start = -1
    activeRange.end = -1
  }

  onPageMounted(() => {
    clearObserver()
    observeHeading()
  })

  return { anchors }
})

export function useActiveRanve() {
  return activeRange
}

export function createSVGMask(toc: OutlineAnchor[]) {
  // toc-item: line-height: 24, padding-block: 4
  const ox = 4 // x 起点
  const xStep = 16 // x 步长
  const yStep = 24 // y 步长，对应文本的行高
  const pad = 4 // padding-top
  const gap = 8 // double padding-top

  let maxLv = 0
  let [x, y] = [ox, -pad]
  const paths = [`M ${ox},4`]

  for (const item of toc) {
    const lv = item.level - 1
    maxLv = Math.max(maxLv, lv)
    const nx = ox + lv * xStep
    if (nx !== x) {
      paths.push(`L ${x},${y}`)
      x = nx
      y += gap
      paths.push(`L ${x},${y}`)
      y += yStep
    } else {
      y += yStep + gap
    }
  }
  paths.push(`L ${x},${y}`)

  const width = maxLv * xStep + ox * 2
  const height = toc.length * (yStep + gap)
  const path = paths.join(' ')

  const template = maskSvgTemplate(width, height, path)
  const maskURL = `data:image/svg+xml,${template}`

  return { width, height, path, maskURL }
}

function maskSvgTemplate(width: number, height: number, path: string) {
  const template = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${width} ${height}"
      height="${height}"
      width="${width}"
    >
      <path d="${path}" fill="none" stroke="currentColor" stroke-width="1" />
    </svg>
  `
  return template
    .trim()
    .replaceAll(/\r?\n/g, '')
    .replaceAll(/\s+/g, ' ')
    .replaceAll(/([">])\s+/g, '$1%20')
}
