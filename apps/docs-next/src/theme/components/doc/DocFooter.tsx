import { useMenuActiveNode } from '../../controller/menus'
import { EbbLink } from '../Link'

export function DocFooter() {
  return (
    <footer className="mt-16">
      <div className="h-px bg-divider"></div>
      <FooterNavigation />
    </footer>
  )
}

function FooterNavigation() {
  const currActiveNode = useMenuActiveNode()

  const prevNav = currActiveNode?.prevNav
  const nextNav = currActiveNode?.nextNav

  return (
    <nav
      aria-label="pager"
      className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2"
    >
      {prevNav && (
        <div className="rounded-2 border border-divider transition-colors duration-250 hover:border-brand-2">
          <EbbLink className="flex-col px-4 py-3" href={prevNav.link}>
            <span className="text-12px text-muted-foreground leading-20px">
              上一页
            </span>
            <span className="text-14px text-brand-2 leading-20px">
              {prevNav?.text}
            </span>
          </EbbLink>
        </div>
      )}
      {nextNav && (
        <div className="rounded-2 border border-divider transition-colors duration-250 hover:border-brand-2 sm:col-2">
          <EbbLink
            className="flex-col px-4 py-3 text-right"
            href={nextNav.link}
          >
            <span className="text-12px text-muted-foreground leading-20px">
              下一页
            </span>
            <span className="text-14px text-brand-2 leading-20px">
              {nextNav.text}
            </span>
          </EbbLink>
        </div>
      )}
    </nav>
  )
}
