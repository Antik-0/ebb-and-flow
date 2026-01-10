import type { RefObject } from 'react'
import type { MaybeRefOrGetter } from '#/utils'
import { useEffect, useMemo, useRef } from 'react'
import { toValue } from '#/utils'

interface Options extends KeyframeEffectOptions {
  target?: MaybeRefOrGetter<Element | null>
  timeline?: AnimationTimeline | null
}

type AnimationProxy = Omit<Animation, 'effect'> & {
  effect: KeyframeEffect | null
  isReady: boolean
  isRunning: boolean
}

export function useAnimation<T extends Element = Element>(
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options: Options
) {
  const { target, timeline, ...effectOptions } = options

  const motionRaw = useRef<Animation | null>(null)
  const animation = useMemo(
    () => createAnimationProxy(() => motionRaw.current),
    []
  )

  const scope = useRef<T | null>(null)
  const scopeProxy = useMemo(
    () =>
      createScopeProxy(scope, target => {
        const effect = animation.effect
        effect && (effect.target = target)
      }),
    []
  )

  useEffect(() => {
    // 只绑定一次 target，后续 target 变更，手动更新
    const _target = toValue(target) ?? null
    _target && (scope.current = _target as T)

    // 创建动画对象原型
    const effect = new KeyframeEffect(scope.current, keyframes, effectOptions)
    motionRaw.current = new Animation(effect, timeline)

    return () => {
      motionRaw.current = null
    }
  }, [])

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
  scope: RefObject<T>,
  setValue: (value: T) => void
) {
  return new Proxy(scope, {
    set(target, p, newValue, receiver) {
      if (p === 'current') {
        setValue(newValue)
      }
      return Reflect.set(target, p, newValue, receiver)
    }
  })
}
