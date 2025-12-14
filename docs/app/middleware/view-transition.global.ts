function enableTransition() {
  return (
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  )
}

async function viewTransition(motion: 'fade-in' | 'fade-out') {
  if (!enableTransition()) return

  const html = document.documentElement
  const transition = document.startViewTransition(() => {
    html.setAttribute('data-motion', motion)
  })

  await transition.finished
  html.removeAttribute('data-motion')
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) {
    return
  }

  if (to.path === from.path) {
    return
  }

  if (to.path === '/') {
    viewTransition('fade-in')
  } else if (from.path === '/') {
    viewTransition('fade-out')
  }
})
