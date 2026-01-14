'use client'
import type { PropsWithChildren } from 'react'
import type { Page } from '../../types'
import { useLayout } from '../../controller/layout'
import { NotFound } from '../NotFound'
import { DocFooter } from './DocFooter'

interface Props {
  page?: Page
}

export function DocContent(props: PropsWithChildren<Props>) {
  const { page, children } = props

  const isDesktop = useLayout(state => state.isDesktop)

  if (page) {
    return <NotFound />
  }

  return (
    <div className="flex" data-role="doc-content">
      <div className="px-8 pb-24 flex-1 min-w-0">
        <article className="ebb-doc" id="content">
          {children}
        </article>
        <DocFooter />
      </div>

      {isDesktop && (
        <div className="pl-8 w-64">
          <aside className="doc-aside">
            <div className="aside-content">
              <div className="flex-1"></div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
