'use client'
import type { PropsWithChildren } from 'react'
import type { Page } from '../../types'
import { clsx } from '@repo/utils'
import { useEffect } from 'react'
import { pageStore, triggerPageMounted } from '../../controller/layout'
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

  useEffect(() => {
    triggerPageMounted()
  }, [])

  return (
    <div className="flex" data-role="doc-content">
      <div className="px-8 pb-24 flex-1 min-w-0">
        <article className="ebb-doc" id="content">
          {children}
        </article>
        <DocFooter />
      </div>

      <div className="pl-4 w-64" data-role="doc-aside">
        <aside className="pb-12 pt-[calc(var(--h-navbar)+48px)] flex-col w-56 inset-y-0 fixed">
          <div
            className={clsx(
              'flex-col flex-1 overflow-x-hidden overflow-y-auto',
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
