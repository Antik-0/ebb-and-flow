import { onBeforeUnmount, onMounted } from 'vue'

export function useInterval(handler: () => void, timerout: number) {
  let raf: number | null = null
  let lastTime: number | undefined

  function interval(timestamp: DOMHighResTimeStamp) {
    if (!lastTime) {
      lastTime = timerout
    }

    if (timestamp - lastTime > timerout) {
      handler()
      lastTime = timestamp
    }

    raf = window.requestAnimationFrame(interval)
  }

  function start() {
    raf = window.requestAnimationFrame(interval)
  }

  function stop() {
    raf && window.cancelAnimationFrame(raf)
    raf = null
    lastTime = undefined
  }

  onMounted(start)
  onBeforeUnmount(stop)
}
