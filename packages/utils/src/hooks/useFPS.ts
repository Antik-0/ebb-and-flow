import { shallowRef } from 'vue'
import { useAnimationFrame } from './useAnimationFrame.ts'

export function useFPS() {
  let count = 0
  let lastTime = 0
  const fps = shallowRef(0)

  useAnimationFrame(time => {
    count += 1
    if (time - lastTime >= 1000) {
      fps.value = count
      lastTime = time
      count = 0
    }
  })

  return { fps }
}
