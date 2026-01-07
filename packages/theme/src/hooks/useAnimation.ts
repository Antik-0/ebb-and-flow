import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { onBeforeUnmount, onMounted, shallowRef, toValue } from 'vue'

interface Options extends KeyframeEffectOptions {
  target?: MaybeRefOrGetter<Element | null>
  timeline?: AnimationTimeline | null
}

type AnimationProxy = Omit<Animation, 'effect'> & {
  effect: KeyframeEffect | null
  isReady: boolean
  isRunning: boolean
}

export function useAnimation(
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options: Options
) {
  const { target, timeline, ...effectOptions } = options

  let motionRaw: Animation | null = null
  const animation = createAnimationProxy(() => motionRaw)

  const scope = shallowRef<Element | null>(null)
  const scopeProxy = createScopeProxy(scope, target => {
    const effect = animation.effect
    effect && (effect.target = target)
  })

  onMounted(() => {
    // 只绑定一次 target，后续 target 变更，手动更新
    const _target = toValue(target) ?? null
    _target && (scope.value = _target)

    // 创建动画对象原型
    const effect = new KeyframeEffect(scope.value, keyframes, effectOptions)
    motionRaw = new Animation(effect, timeline)
  })

  onBeforeUnmount(() => {
    motionRaw = null
  })

  return [animation, scopeProxy] as const
}

function createAnimationProxy(getter: () => Animation | null) {
  return new Proxy({} as AnimationProxy, {
    get(_, p) {
      const animation = getter()
      if (p === 'isReady') {
        return animation !== null
      }
      if (animation === null) return null

      if (p === 'isRunning') {
        return animation.playState === 'running'
      }

      const value = Reflect.get(animation, p)
      if (typeof value === 'function') {
        return value.bind(animation)
      }
      return value
    },
    set(_, p, newValue) {
      const animation = getter()
      if (animation === null) {
        console.warn('[useAnimation] The animation object is not ready yet.')
        return false
      }
      return Reflect.set(animation, p, newValue)
    }
  })
}

function createScopeProxy<T extends Element | null>(
  scope: ShallowRef<T>,
  setValue: (value: T) => void
) {
  return new Proxy(scope, {
    set(target, p, newValue, receiver) {
      if (p === 'value') {
        setValue(newValue)
      }
      return Reflect.set(target, p, newValue, receiver)
    }
  })
}
