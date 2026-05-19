import { useResizeObserver } from 'ebb-theme'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

export function useAnimationWorker(workerURL: URL) {
  const { onWindowResize } = useResizeObserver()
  const canvas = useTemplateRef<HTMLCanvasElement>('animation')
  let worker: Worker = null!

  onMounted(async () => {
    worker = new Worker(workerURL, { type: 'module' })

    const offscreenCanvas = canvas.value!.transferControlToOffscreen()
    offscreenCanvas.width = window.innerWidth
    offscreenCanvas.height = window.innerHeight

    worker.postMessage(
      {
        type: 'start',
        payload: { canvas: offscreenCanvas }
      },
      [offscreenCanvas]
    )

    onWindowResize(() => {
      const width = window.innerWidth
      const height = window.innerHeight
      worker.postMessage({
        type: 'update',
        payload: { width, height }
      })
    })
  })

  onBeforeUnmount(() => {
    worker.postMessage({ type: 'stop' })
    worker.terminate()
  })
}
