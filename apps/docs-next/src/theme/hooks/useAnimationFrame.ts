import { useEffect, useEffectEvent, useRef } from 'react'

export function useAnimationFrame(
  callback: (time: number) => void,
  timeout: number = 0
) {
  const raf = useRef<number | null>(null)
  const startTime = useRef<number | undefined>(undefined)
  const lastInvokeTime = useRef<number | undefined>(undefined)

  const handler = useEffectEvent((timestamp: DOMHighResTimeStamp) => {
    if (!startTime.current) {
      startTime.current = timestamp
      lastInvokeTime.current = timestamp
    }
    if (timestamp - lastInvokeTime.current! >= timeout) {
      callback(timestamp - startTime.current!)
      lastInvokeTime.current = timestamp
    }
  })

  function start() {
    if (raf.current) return

    const motionFrame = (timestamp: DOMHighResTimeStamp) => {
      handler(timestamp)
      raf.current = window.requestAnimationFrame(motionFrame)
    }
    raf.current = window.requestAnimationFrame(motionFrame)
  }

  function pause() {
    raf.current && window.cancelAnimationFrame(raf.current)
    raf.current = null
  }

  function stop() {
    pause()
    startTime.current = undefined
    lastInvokeTime.current = undefined
  }

  useEffect(() => {
    start()
    return stop
  }, [])

  return { start, pause, stop }
}
