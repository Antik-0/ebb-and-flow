import { onBeforeUnmount, onMounted } from 'vue'

export function useMotionFrame(callback: () => void, timeout: number) {
  let raf: number | null = null
  let lastTime: number | undefined

  function handle(timestamp: DOMHighResTimeStamp) {
    if (!lastTime) {
      lastTime = timestamp
    }

    if (timestamp - lastTime > timeout) {
      callback()
      lastTime = timestamp
    }

    raf = window.requestAnimationFrame(handle)
  }

  function start() {
    raf = window.requestAnimationFrame(handle)
  }

  function stop() {
    raf && window.cancelAnimationFrame(raf)
    raf = null
    lastTime = undefined
  }

  onMounted(start)
  onBeforeUnmount(stop)
}
