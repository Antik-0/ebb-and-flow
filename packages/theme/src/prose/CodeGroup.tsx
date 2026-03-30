import { clsx } from '@repo/utils'
import { computed, defineComponent, ref } from 'vue'
import { LogoIconRender } from '#/icons'

interface TabItem {
  text: string
  icon: string
}

export const CodeGroup = defineComponent<{
  tabs: TabItem[]
}>(
  (props, { slots }) => {
    const activeIndex = ref(0)

    const children = computed(() => {
      return slots.default?.() ?? []
    })

    return () => (
      <div class="my-4 rounded-2 relative overflow-hidden">
        <div class="p-2 bg-[--c-bg-code-title]/80 flex gap-1 items-center">
          {props.tabs.map((item, index) => (
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
              <span class="text-sm">{item.text}</span>
            </button>
          ))}
        </div>
        {children.value.map((node, index) => (
          <div key={index} v-show={activeIndex.value === index}>
            {node}
          </div>
        ))}
      </div>
    )
  },
  { props: ['tabs'] }
)
