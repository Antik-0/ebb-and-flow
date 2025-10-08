import type { MaybeRefOrGetter } from 'vue'
import { computed, onBeforeUnmount, onMounted, shallowRef, toValue } from 'vue'

export function useMediaQuery(
  query: MaybeRefOrGetter<string>,
  options: { initialValue?: boolean } = {}
) {
  const mediaQuery = shallowRef<MediaQueryList>()
  const matches = shallowRef(options.initialValue ?? false)

  function handler(event: MediaQueryListEvent) {
    matches.value = event.matches
  }

  onMounted(() => {
    mediaQuery.value = window.matchMedia(toValue(query))
    mediaQuery.value.addEventListener('change', handler)
    matches.value = mediaQuery.value.matches
  })

  onBeforeUnmount(() => {
    mediaQuery.value?.removeEventListener('change', handler)
  })

  return computed(() => matches.value)
}
