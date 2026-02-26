import type { OutlineAnchor } from '#/types'
import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import { useIntersectionObserver } from '#/hooks'
import { usePageData } from './layout'

let activeState: number[] = []
const activeRange = reactive({
  start: -1,
  end: -1
})

export function useOutline() {
  const { page } = usePageData()
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

  onMounted(() => {
    watch(
      () => anchors.value,
      () => {
        observeHeading()
        return clearObserver
      },
      { immediate: true }
    )
  })

  onBeforeUnmount(clearObserver)

  return { anchors }
}

export function useActiveRange() {
  return activeRange
}

export function createSVGMask(toc: OutlineAnchor[]) {
  const ox = 2
  const xg = 16
  const yg = 12
  const size = 20

  let [x, y] = [ox, -(yg / 2)]
  let maxLv = 0
  const paths = [`M ${ox},0`]

  for (const item of toc) {
    const lv = item.level
    maxLv = Math.max(maxLv, lv)
    const nx = ox + lv * xg
    if (nx !== x) {
      paths.push(`L ${x},${y}`)
      x = nx
      y += yg
      paths.push(`L ${x},${y}`)
      y += size
    } else {
      y += size + yg
    }
  }
  y += yg / 2
  paths.push(`L ${x},${y}`)

  const width = maxLv * xg + ox * 2
  const height = toc.length * (size + yg)
  const path = paths.join(' ')

  const template = maskSvgTemplate(width, height, path)

  return { width, height, path, template }
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
}
