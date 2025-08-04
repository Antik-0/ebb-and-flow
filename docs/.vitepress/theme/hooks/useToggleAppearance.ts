import { enableTransitions } from '@repo/utils'
import { useData } from 'vitepress'
import { nextTick, provide } from 'vue'

export function useToggleAppearance() {
  const { isDark } = useData()

  async function toggleAppearance({ clientX: x, clientY: y }: MouseEvent) {
    if (!enableTransitions()) {
      isDark.value = !isDark.value
      return
    }

    const html = document.documentElement
    html.style.viewTransitionName = 'appearance'

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )}px at ${x}px ${y}px)`
    ]

    const viewTransition = document.startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    })

    await viewTransition.ready

    html.animate(
      { clipPath: isDark.value ? clipPath.reverse() : clipPath },
      {
        duration: 300,
        easing: 'ease-in',
        fill: 'forwards',
        pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(appearance)`
      }
    )

    await viewTransition.finished

    nextTick(() => (html.style.viewTransitionName = ''))
  }

  provide('toggle-appearance', toggleAppearance)
}
