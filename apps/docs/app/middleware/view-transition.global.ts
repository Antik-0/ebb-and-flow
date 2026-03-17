function enableTransition() {
  return (
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  )
}

async function viewTransition(motion: string) {
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
    viewTransition('ebb-in')
  } else if (from.path === '/') {
    viewTransition('ebb-out')
  } else if (to.path === '/archive') {
    viewTransition('flow-in')
  } else if (from.path === '/archive') {
    viewTransition('flow-out')
  }
})
