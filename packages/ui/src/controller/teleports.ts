import type { InjectionKey, ShallowRef } from 'vue'
import { nextTick, onMounted, provide, shallowRef } from 'vue'

export const TeleportsContext = Symbol('teleprots') as InjectionKey<{
  ready: ShallowRef<boolean>
}>

export const TeleportsId = 'teleports'

export function useTeleprots() {
  const ready = shallowRef(false)

  onMounted(async () => {
    if (document.getElementById(TeleportsId)) {
      ready.value = true
      return
    }

    const view = document.createElement('div')
    view.id = TeleportsId
    document.body.append(view)
    await nextTick()
    ready.value = true
  })

  provide(TeleportsContext, { ready })
}
