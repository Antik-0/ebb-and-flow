import { onBeforeUnmount, onMounted } from 'vue'

export function useAnimationFrame(
  callback: (time: number) => void,
  timeout: number = 0
) {
  let raf: number | null = null
  let startTime: number | undefined
  let lastInvokeTime: number | undefined

  function handle(timestamp: DOMHighResTimeStamp) {
    if (!startTime) {
      startTime = timestamp
      lastInvokeTime = timestamp
    }
    if (timestamp - lastInvokeTime! >= timeout) {
      callback(timestamp - startTime)
      lastInvokeTime = timestamp
    }
    raf = window.requestAnimationFrame(handle)
  }

  function start() {
    raf = window.requestAnimationFrame(handle)
  }

  function pause() {
    raf && window.cancelAnimationFrame(raf)
    raf = null
  }

  function stop() {
    pause()
    startTime = undefined
    lastInvokeTime = undefined
  }

  onMounted(start)
  onBeforeUnmount(stop)

  return { start, pause, stop }
}
