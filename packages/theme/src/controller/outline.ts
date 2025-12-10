import { throttle } from '@repo/utils'
import { useEventListener } from '@repo/utils/hooks'
import { computed, onMounted, shallowRef, watch } from 'vue'
import { usePageData } from './layout'

export function useOutline() {
  const { page } = usePageData()

  const anchors = computed(() => page.value?.toc ?? [])
  const activeIndex = shallowRef(-1)

  let offsetTopMap: number[] = []

  const { addEventListener } = useEventListener()

  const computeActivedAnchor = throttle(() => {
    const root = document.documentElement
    const scrollTop = root.scrollTop
    const scrollHeight = root.scrollHeight

    if (scrollTop + window.innerHeight + 10 > scrollHeight) {
      activeIndex.value = anchors.value.length - 1
      return
    }

    let activated = -1
    for (const [index, offsetTop] of offsetTopMap.entries()) {
      if (offsetTop - scrollTop <= 200) {
        activated = index
      } else {
        break
      }
    }

    activeIndex.value = activated
  }, 100)

  function createOffsetTopMap() {
    const container = document.getElementById('content')
    if (!container) return []

    const result: number[] = []
    for (const anchor of anchors.value) {
      const id = anchor.to
      const node = container.querySelector(id)
      if (node) {
        result.push(calcOffsetTop(node as HTMLElement))
      }
    }
    return result
  }

  onMounted(() => {
    watch(
      () => anchors.value,
      () => {
        offsetTopMap = createOffsetTopMap()
        computeActivedAnchor()
      },
      { immediate: true }
    )
    addEventListener(window, 'scroll', computeActivedAnchor)
  })

  return { anchors, activeIndex }
}

function calcOffsetTop(node: HTMLElement) {
  let offsetTop = 0
  while (node) {
    offsetTop += node.offsetTop
    node = node.offsetParent as HTMLElement
  }
  return offsetTop
}
