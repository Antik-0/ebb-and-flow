import { defineComponent } from 'vue'
import { useCurrActiveNode } from '#/controller/menus'
import { Link } from '../Link.tsx'

export const DocFooter = defineComponent(
  () => {
    const currActiveNode = useCurrActiveNode()

    return () => {
      const prevNav = currActiveNode.value?.prevNav
      const nextNav = currActiveNode.value?.nextNav

      return (
        <footer class="mt-16">
          <div class="h-px bg-divider"></div>

          <nav
            aria-label="pager"
            class="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2"
          >
            {prevNav && (
              <div class="rounded-2 border border-divider transition-colors duration-300 hover:border-brand-2">
                <Link class="flex-col px-4 py-3" href={prevNav.link}>
                  <span class="text-12px text-muted-foreground leading-20px">
                    上一页
                  </span>
                  <span class="text-14px text-brand-2 leading-20px">
                    {prevNav.text}
                  </span>
                </Link>
              </div>
            )}
            {nextNav && (
              <div class="rounded-2 border border-divider transition-colors duration-300 hover:border-brand-2 sm:col-2">
                <Link class="flex-col px-4 py-3 text-right" href={nextNav.link}>
                  <span class="text-12px text-muted-foreground leading-20px">
                    下一页
                  </span>
                  <span class="text-14px text-brand-2 leading-20px">
                    {nextNav.text}
                  </span>
                </Link>
              </div>
            )}
          </nav>
        </footer>
      )
    }
  },
  { name: 'DocFooter' }
)
