import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, onMounted, shallowRef, toValue, watch } from 'vue'

interface Options {
  target?: MaybeRefOrGetter<Element | null>
  effect?: KeyframeEffectOptions
  timeline?: AnimationTimeline | null
  onFinish?: (event: AnimationPlaybackEvent) => void
}

export function useAnimation(
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options: Options = {}
) {
  const scope = shallowRef<Element | null>(null)
  const effect = shallowRef<KeyframeEffect>()
  const animation = shallowRef<Animation>()

  const { effect: effectOptions, timeline, onFinish } = options

  watch(
    scope,
    () => {
      if (!effect.value) return
      effect.value.target = scope.value
    },
    { flush: 'sync' }
  )

  onMounted(() => {
    const target = toValue(options.target) ?? null
    target && (scope.value = target)
    effect.value = new KeyframeEffect(target, keyframes, effectOptions)
    animation.value = new Animation(effect.value, timeline)

    onFinish && animation.value.addEventListener('finish', onFinish)
  })

  onBeforeUnmount(() => {
    animation.value?.cancel()
    onFinish && animation.value?.removeEventListener('finish', onFinish)
  })

  return { scope, animation, effect }
}
