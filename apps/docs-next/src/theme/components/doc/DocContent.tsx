'use client'
import type { PropsWithChildren } from 'react'
import type { Page } from '../../types'
import { clsx } from '@repo/utils'
import { useEffect } from 'react'
import { pageStore } from '../../controller/layout'
import { DocFooter } from './DocFooter'
import { DocOutline } from './DocOutline'

interface Props {
  page: Page
}

export function DocContent(props: PropsWithChildren<Props>) {
  const { page, children } = props

  useEffect(() => {
    pageStore.setState(page)
  }, [page])

  return (
    <div className="flex" data-role="doc-content">
      <div className="min-w-0 flex-1 px-8 pb-24">
        <article className="ebb-doc" id="content">
          {children}
        </article>
        <DocFooter />
      </div>

      <div className="w-64 pl-4" data-role="doc-aside">
        <aside className="fixed inset-y-0 w-56 flex-col pt-[calc(var(--h-navbar)+48px)] pb-12">
          <div
            className={clsx(
              'flex-1 flex-col overflow-y-auto overflow-x-hidden',
              'opacity-60 transition-opacity hover:opacity-100'
            )}
          >
            <DocOutline />
            <div className="flex-1"></div>
          </div>
        </aside>
      </div>
    </div>
  )
}
