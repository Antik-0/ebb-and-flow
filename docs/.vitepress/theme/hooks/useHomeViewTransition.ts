import { enableTransitions } from '@repo/utils'
import { nextTick } from 'vue'

export function useHomeViewTransition() {
  async function viewTransitionStart(out: boolean) {
    if (!enableTransitions()) return

    const html = document.documentElement
    html.style.viewTransitionName = 'home'

    const transition = document.startViewTransition(() => {
      html.setAttribute('data-slide', out ? 'out' : 'in')
    })

    await transition.finished

    nextTick(() => {
      html.removeAttribute('data-slide')
      html.style.viewTransitionName = ''
    })
  }

  return { viewTransitionStart }
}
;``
