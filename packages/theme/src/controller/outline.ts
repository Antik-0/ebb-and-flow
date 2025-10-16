import { throttle } from '@repo/utils'
import { useEventListener } from '@repo/utils/hooks'
import { useData } from 'vitepress'
import { onMounted, shallowRef, watch } from 'vue'

interface Anchor {
  text: string
  to: string
  level: number
  offsetTop: number
}

function calcOffsetTop(node: HTMLElement) {
  let offsetTop = 0
  while (node) {
    offsetTop += node.offsetTop
    node = node.offsetParent as HTMLElement
  }
  return offsetTop
}

export function useOutline() {
  const anchors = shallowRef<Anchor[]>([])
  const activeIndex = shallowRef(-1)

  const { page } = useData()

  watch(page, createOutlineAnchors, { flush: 'post' })

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
    for (const [index, anchor] of anchors.value.entries()) {
      if (anchor.offsetTop - scrollTop <= 200) {
        activated = index
      } else {
        break
      }
    }

    activeIndex.value = activated
  }, 200)

  onMounted(() => {
    createOutlineAnchors()
    computeActivedAnchor()
    addEventListener(window, 'scroll', computeActivedAnchor)
  })

  function createOutlineAnchors() {
    window.requestAnimationFrame(() => {
      const content = document.getElementById('content')
      if (!content) {
        anchors.value = []
        activeIndex.value = 0
        return
      }

      const elements = content.querySelectorAll<HTMLElement>('h2,h3')

      const data: Anchor[] = []
      for (const element of elements) {
        const offsetTop = calcOffsetTop(element)
        data.push({
          text: element.id,
          to: `#${element.id}`,
          level: Number(element.tagName.at(-1)) - 2,
          offsetTop
        })
      }

      anchors.value = data
    })
  }

  return { anchors, activeIndex }
}
