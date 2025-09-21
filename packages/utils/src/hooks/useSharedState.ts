import type { EffectScope } from 'vue'
import { effectScope, onScopeDispose } from 'vue'

export function createSharedState<
  T extends (...args: any[]) => any,
  S = ReturnType<T>
>(fn: T) {
  let subscribers = 0
  let scope: EffectScope | null
  let state: S | null

  const dispose = () => {
    if (scope && --subscribers <= 0) {
      scope.stop()
      state = scope = null
    }
  }

  return (...args: Parameters<T>) => {
    subscribers++
    if (!state) {
      scope = effectScope(true)
      state = scope.run(() => fn(...args))
    }
    onScopeDispose(dispose)
    return state!
  }
}
