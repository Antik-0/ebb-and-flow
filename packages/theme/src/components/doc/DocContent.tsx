import type { Page } from '#/types'
import { defineComponent, watch } from 'vue'
import { setPageData } from '#/controller/layout'
import { useTocMotion } from '#/controller/outline'
import { NotFound } from '../NotFound.tsx'
import { DocFooter } from './DocFooter.tsx'
import { DocOutline } from './DocOutline.tsx'

export const DocContent = defineComponent<{ page?: Page }>(
  (props, { slots }) => {
    watch(
      () => props.page,
      value => setPageData(value ?? null),
      { immediate: true }
    )

    useTocMotion()

    return () => {
      const { page } = props
      if (!page) return <NotFound />

      return (
        <div class="flex" data-role="doc-content">
          <div class="min-w-0 flex-1 px-8 pb-24">
            <article class="ebb-doc" id="content">
              {slots.default?.()}
            </article>
            <DocFooter />
          </div>

          <div class="w-64 pl-4" data-role="doc-aside">
            <aside class="fixed inset-y-0 w-56 flex-col pt-[calc(var(--h-navbar)+48px)] pb-12">
              <div
                class={[
                  'flex-1 flex-col overflow-y-auto overflow-x-hidden',
                  'opacity-60 transition-opacity hover:opacity-100'
                ]}
              >
                <DocOutline />
                <div class="flex-1"></div>
              </div>
            </aside>
          </div>
        </div>
      )
    }
  },
  { name: 'DocContent', props: ['page'] }
)
