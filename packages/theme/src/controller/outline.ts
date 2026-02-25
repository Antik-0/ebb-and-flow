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
