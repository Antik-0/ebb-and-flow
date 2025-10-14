import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, onMounted, shallowRef, toValue } from 'vue'

interface AnimationOptions {
  timeline?: AnimationTimeline | null
  onFinish?: (event: AnimationPlaybackEvent) => void
}

export function useAnimation(
  target: MaybeRefOrGetter<Element | null>,
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  effectOptions?: KeyframeEffectOptions,
  animationOptions?: AnimationOptions
) {
  const animation = shallowRef<Animation>(undefined!)
  const effect = shallowRef<KeyframeEffect>(undefined!)

  const { timeline, onFinish } = animationOptions ?? {}

  onMounted(() => {
    const element = toValue(target)
    effect.value = new KeyframeEffect(element, keyframes, effectOptions)
    animation.value = new Animation(effect.value, timeline)

    if (onFinish) {
      animation.value.addEventListener('finish', onFinish)
    }
  })

  onBeforeUnmount(() => {
    animation.value.cancel()
    onFinish && animation.value.removeEventListener('finish', onFinish)
  })

  return [animation, effect] as const
}
