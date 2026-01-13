import { useMenuActiveNode } from '../../controller/menus'
import { EbbLink } from '../Link'

export function DocFooter() {
  return (
    <footer className="mt-16">
      <div className="bg-divider h-px"></div>
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
      className="pt-6 gap-4 grid grid-cols-1 sm:grid-cols-2"
    >
      <div className="border border-divider rounded-2 transition-colors duration-250 hover:border-brand-2">
        {prevNav && (
          <EbbLink className="px-4 py-3 flex-col" href={prevNav.link}>
            <span className="text-12px text-muted-foreground leading-20px">
              上一页
            </span>
            <span className="text-14px text-brand-2 leading-20px">
              {prevNav?.text}
            </span>
          </EbbLink>
        )}
        {nextNav && (
          <EbbLink
            className="px-4 py-3 text-right flex-col"
            href={nextNav.link}
          >
            <span className="text-12px text-muted-foreground leading-20px">
              下一页
            </span>
            <span className="text-14px text-brand-2 leading-20px">
              {nextNav.text}
            </span>
          </EbbLink>
        )}
      </div>
    </nav>
  )
}
