import { clsx } from '@repo/utils'
import { computed, defineComponent, ref } from 'vue'
import { LogoIconRender } from '#/icons'

interface CodeItem {
  code: string
  filename?: string
  language?: string
}

export const CodeGroup = defineComponent((_, { attrs, slots }) => {
  const activeIndex = ref(0)

  const codeItems = computed(() => {
    const children = slots.default?.()
    if (!children) return []

    return children.map(vnode => {
      const props = vnode.props as CodeItem
      return {
        title: props.filename || props.language,
        icon: props.language,
        code: props.code,
        component: vnode
      }
    })
  })

  return () => (
    <div class="code-group rounded-2 relative overflow-hidden" {...attrs}>
      <div class="p-2 bg-[--c-bg-code-title]/80 flex gap-1 items-center">
        {codeItems.value.map((item, index) => (
          <button
            class={clsx(
              'text-muted-foreground px-2 py-1.5 rounded-md flex gap-1 transition-colors items-center',
              'cursor-pointer hover:text-accent-foreground hover:bg-[--c-bg-code-block]',
              'data-[active=true]:text-accent-foreground data-[active=true]:bg-[--c-bg-code-block]'
            )}
            data-active={activeIndex.value === index}
            key={index}
            onClick={() => (activeIndex.value = index)}
            type="button"
          >
            {item.icon && <LogoIconRender class="size-4" logo={item.icon} />}
            <span class="text-sm">{item.title}</span>
          </button>
        ))}
      </div>
      {codeItems.value.map((item, index) => (
        <div key={index} v-show={activeIndex.value === index}>
          {item.component}
        </div>
      ))}
    </div>
  )
})
