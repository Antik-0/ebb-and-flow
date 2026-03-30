import type { SetupContext } from 'vue'
import Link from '#/components/Link.vue'

export function ProseA(props: { href?: string }, { slots }: SetupContext) {
  return (
    <Link class="ebb-link relative" href={props.href}>
      {slots.default?.()}
    </Link>
  )
}
