import { isExternalLink } from '@repo/utils'
import { computed, defineComponent, h, resolveComponent } from 'vue'

export const Link = defineComponent<{ href?: string }>(
  (props, { slots, attrs }) => {
    const NuxtLink = resolveComponent('NuxtLink')

    const isExternal = computed(() => isExternalLink(props.href ?? ''))
    const target = computed(() => (isExternal.value ? '_blank' : undefined))
    const rel = computed(() => (isExternal.value ? 'noreferrer' : undefined))

    return () => {
      if (!props.href) {
        return h('span', { ...attrs }, slots.default?.())
      }

      return h(
        NuxtLink,
        {
          rel: rel.value,
          href: props.href,
          target: target.value,
          ...attrs
        },
        () => slots.default?.()
      )
    }
  },
  { name: 'EbbLink', props: ['href'] }
)
