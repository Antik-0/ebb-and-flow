function enableTransition() {
  return (
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  )
}

function viewTransition(motion: string) {
  if (!enableTransition()) return

  window.requestAnimationFrame(async () => {
    const html = document.documentElement
    const transition = document.startViewTransition(() => {
      html.setAttribute('data-motion', motion)
    })

    await transition.finished
    html.removeAttribute('data-motion')
  })
}

export function withViewTransition(from: string, to: string) {
  if (to === from) {
    return
  }

  if (to === '/') {
    viewTransition('ebb-in')
  } else if (from === '/') {
    viewTransition('ebb-out')
  } else if (to === '/archive') {
    viewTransition('flow-in')
  } else if (from === '/archive') {
    viewTransition('flow-out')
  }
}
