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
      <div class="relative my-4 overflow-hidden rounded-2">
        <div class="flex items-center gap-1 bg-[--c-bg-code-title]/80 p-2">
          {props.tabs.map((item, index) => (
            <button
              class={clsx(
                'flex items-center gap-1 rounded-md px-2 py-1.5 text-muted-foreground transition-colors',
                'cursor-pointer hover:bg-[--c-bg-code-block] hover:text-accent-foreground',
                'data-[active=true]:bg-[--c-bg-code-block] data-[active=true]:text-accent-foreground'
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
