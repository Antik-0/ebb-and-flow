import { computed, defineComponent, onMounted, useTemplateRef } from 'vue'
import { useIntersectionObserver } from '#/hooks'

export const ViewportSentinel = defineComponent<
  { top?: number; bottom?: number },
  { visibleChange: (value: boolean) => void }
>(
  (props, { emit }) => {
    const style = computed(() => {
      const { top, bottom } = props
      if (top) {
        return { top: top + 'px' }
      }
      if (bottom) {
        return { bottom: bottom + 'px' }
      }
      return undefined
    })

    const sentinel = useTemplateRef<HTMLDivElement>('sentinel')

    const { observe } = useIntersectionObserver()

    onMounted(() => {
      observe(sentinel.value, entry => {
        emit('visibleChange', entry.isIntersecting)
      })
    })

    return () => (
      <div
        aria-hidden="true"
        class="absolute inset-x-0 -z-1 h-1"
        data-role="sentinel"
        ref="sentinel"
        style={style.value}
      ></div>
    )
  },
  { name: 'ViewportSentinel' }
)
