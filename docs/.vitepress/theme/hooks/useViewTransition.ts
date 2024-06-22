const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

export function useViewTransition() {
  let transitionResolve: ((value: unknown) => void) | null = null

  async function viewTransitionStart(out: boolean) {
    if (!enableTransitions()) return

    const transitionClass = out ? 'home-slide-out' : 'home-slide-in'
    const transitionPromise = new Promise(
      resolve => (transitionResolve = resolve)
    )

    const transition = (document as any).startViewTransition(async () => {
      document.documentElement.classList.add(transitionClass)
      await transitionPromise
    })

    await transition.finished
    document.documentElement.classList.remove(transitionClass)
    transitionResolve = null
  }

  function viewTransitionEnd() {
    transitionResolve && transitionResolve(true)
  }

  return { viewTransitionStart, viewTransitionEnd }
}
