'use client'
import type { PropsWithChildren } from 'react'
import type { PageData } from '../../types'
import { useEffect } from 'react'
import { pageStore, useLayout } from '../../controller/layout'
import { DocFooter } from './DocFooter'
import { DocOutline } from './DocOutline'

interface Props {
  page: PageData
}

export function DocContent(props: PropsWithChildren<Props>) {
  const { page, children } = props

  const isDesktop = useLayout(state => state.isDesktop)

  useEffect(() => {
    pageStore.setState(page)
  }, [page])

  return (
    <div className="flex" data-role="doc-content">
      <div className="px-8 pb-24 flex-1 min-w-0">
        <article className="ebb-doc" id="ebb-content">
          {children}
        </article>
        <DocFooter />
      </div>

      {isDesktop && (
        <div className="pl-8 w-64">
          <aside className="doc-aside">
            <div className="aside-content">
              <DocOutline />
              <div className="flex-1"></div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
