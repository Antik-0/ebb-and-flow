import type { ShallowRef } from 'vue'
import { defineComponent, onMounted, reactive, shallowRef } from 'vue'

export const CssGlass = defineComponent(() => {
  const glass = shallowRef<HTMLDivElement>()

  useMove(glass)

  return () => (
    <div class="glass-container">
      <div class="glass" ref={glass}>
        <div class="glass-text">Drag Me</div>
      </div>
    </div>
  )
})

function useMove(target: ShallowRef<HTMLElement | undefined | null>) {
  const pressedDelta = reactive({ x: 0, y: 0 })

  let targetElement: HTMLElement
  let containerElement: HTMLElement

  let targetRect: DOMRect
  let containerRect: DOMRect

  function start(e: PointerEvent) {
    targetRect = targetElement.getBoundingClientRect()
    containerRect = containerElement.getBoundingClientRect()

    pressedDelta.x = e.offsetX
    pressedDelta.y = e.offsetY

    targetElement.style.cursor = 'move'
    document.addEventListener('pointermove', move)
  }

  function move(e: PointerEvent) {
    let x = e.clientX - pressedDelta.x - containerRect.left
    x = Math.min(Math.max(0, x), containerRect.width - targetRect.width)

    let y = e.clientY - pressedDelta.y - containerRect.top
    y = Math.min(Math.max(0, y), containerRect.height - targetRect.height)

    targetElement.style.top = y + 'px'
    targetElement.style.left = x + 'px'
  }

  function end() {
    pressedDelta.x = 0
    pressedDelta.y = 0

    targetElement.style.cursor = ''
    document.removeEventListener('pointermove', move)
  }

  onMounted(() => {
    targetElement = target.value!
    containerElement = document.querySelector('.glass-container')!

    targetElement.addEventListener('pointerdown', start)
    document.addEventListener('pointerup', end)
  })
}
