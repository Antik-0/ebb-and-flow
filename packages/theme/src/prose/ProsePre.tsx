import { clsx } from '@repo/utils'
import { defineComponent, ref } from 'vue'
import { Copy, CopyCheck } from '../icons'

interface Props {
  code?: string
  language?: string
  filename?: string
}

export const ProsePre = defineComponent<Props>(
  (props, { attrs, slots }) => {
    const { code } = props
    const copied = ref(false)

    async function handleCopy() {
      if (copied.value || !code) return

      await window.navigator.clipboard.writeText(code)
      copied.value = true
      setTimeout(() => (copied.value = false), 2000)
    }

    return () => (
      <pre class="group rounded-2 relative" {...attrs}>
        <button
          aria-label="copy"
          class={clsx(
            'rounded-md flex size-8 cursor-pointer transition-all flex-center right-2 top-2 absolute',
            'text-muted-foreground bg-muted/40 opacity-0',
            'hover:(text-accent-foreground bg-muted) group-hover:opacity-100',
            'data-[active=true]:opacity-100'
          )}
          data-active={copied.value}
          onClick={handleCopy}
          type="button"
        >
          {copied.value ? <CopyCheck /> : <Copy />}
        </button>
        {slots.default?.()}
      </pre>
    )
  },
  { props: ['code', 'language', 'filename'] }
)
