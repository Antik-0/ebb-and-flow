import { clsx } from '@repo/utils'
import { defineComponent, ref } from 'vue'
import { Copy, CopyCheck } from '../icons'

interface Props {
  class?: string
  code?: string
  lines?: number
  language?: string
  filename?: string
}

export const ProsePre = defineComponent<Props>(
  (props, { attrs, slots }) => {
    const { code, lines, language, filename } = props

    const copied = ref(false)
    async function handleCopy() {
      if (copied.value || !code) return

      await window.navigator.clipboard.writeText(code)
      copied.value = true
      setTimeout(() => (copied.value = false), 2000)
    }

    return () => (
      <pre
        class={['group relative rounded-2', props.class]}
        data-filename={filename}
        data-language={language}
        data-lines={lines}
        {...attrs}
      >
        <button
          aria-label="copy"
          class={clsx(
            'absolute top-2 right-2 flex size-8 flex-center cursor-pointer rounded-md transition-all',
            'bg-muted/40 text-muted-foreground opacity-0',
            'hover:bg-muted hover:text-accent-foreground group-hover:opacity-100',
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
  { props: ['class', 'code', 'lines', 'language', 'filename'] }
)
