const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

export function useViewTransition() {
  async function viewTransitionStart(out: boolean) {
    if (!enableTransitions()) return

    const transitionClass = out ? 'home-slide-out' : 'home-slide-in'
    const transition = (document as any).startViewTransition(() => {
      document.documentElement.classList.add(transitionClass)
    })

    await transition.finished
    document.documentElement.classList.remove(transitionClass)
  }

  function sleep(time: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), time))
  }

  return { viewTransitionStart, sleep }
}
