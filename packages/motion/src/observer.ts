type Callback = (entry: ResizeObserverSize) => void

let resizeObserver: ResizeObserver | null = null

function createWindowResizeObserver() {
  resizeObserver = new ResizeObserver(entries => {
    const windowEntry = entries[0]
    if (!windowEntry) return

    const borderBoxSize = windowEntry.borderBoxSize[0]
    const blockSize = borderBoxSize?.blockSize ?? 0
    const inlineSize = borderBoxSize?.inlineSize ?? 0

    for (const callback of resizeCallbacks) {
      callback({ blockSize, inlineSize })
    }
  })
  resizeObserver.observe(document.documentElement)
}

let resizeCallbacks: Callback[] = []

export function onWindowResize(callback: Callback) {
  if (resizeCallbacks.length === 0) {
    createWindowResizeObserver()
  }

  resizeCallbacks.push(callback)

  return () => {
    resizeCallbacks = resizeCallbacks.filter(fn => fn !== callback)
    if (resizeCallbacks.length === 0) {
      resizeObserver?.disconnect()
      resizeObserver = null
    }
  }
}
