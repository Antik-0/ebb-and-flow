import { useRef, useState } from 'react'
import { useAnimationFrame } from './useAnimationFrame.ts'

export function useFPS() {
  const [fps, setFPS] = useState(0)
  const count = useRef(0)
  const lastTime = useRef(0)

  useAnimationFrame(time => {
    count.current += 1
    if (time - lastTime.current >= 1000) {
      setFPS(count.current)
      lastTime.current = time
      count.current = 0
    }
  })

  return fps
}
