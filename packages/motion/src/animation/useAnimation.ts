import type { MaybeRefOrGetter } from 'vue'
import { onMounted, toValue, watch } from 'vue'
import { meteorAnimation } from './meteor'
import { sakuraAnimation } from './sakura'

interface UseAnimationOptions {
  useSakura: MaybeRefOrGetter<boolean>
  sakuaraSource: string
  style: (CSSStyle: CSSStyleDeclaration) => void
}

export function useAnimation(options: UseAnimationOptions) {
  const { useSakura, sakuaraSource, style: setStyle } = options

  const { run: runMeteor, cleanup: cleanupMeteor } = meteorAnimation({
    style: setStyle
  })

  const { run: runSakura, cleanup: cleanupSakura } = sakuraAnimation({
    source: sakuaraSource,
    style: setStyle
  })

  const isUseSakura = () => toValue(useSakura)

  watch(isUseSakura, value => {
    if (value === true) {
      cleanupMeteor()
      runSakura()
    } else {
      cleanupSakura()
      runMeteor()
    }
  })

  onMounted(() => {
    if (isUseSakura()) {
      runSakura()
    } else {
      runMeteor()
    }
  })
}
