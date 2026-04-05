import type { SetupContext } from 'vue'
import { isExternalLink } from '@repo/utils'
import Link from '#/components/Link.vue'
import { ArrowUpRight } from '#/icons'

export function ProseA(props: { href?: string }, { slots }: SetupContext) {
  const isExternal = isExternalLink(props.href ?? '')
  return (
    <Link class="ebb-link relative" href={props.href}>
      {slots.default?.()}
      {isExternal && <ArrowUpRight class="size-4" />}
    </Link>
  )
}
