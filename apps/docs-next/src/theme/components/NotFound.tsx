import { EbbLink } from './Link'

export function EbbNotFound() {
  return (
    <div className="px-8 py-24 text-center w-full">
      <p className="text-16 leading-[1] font-600">404</p>
      <h1 className="text-5 leading-[2] tracking-2px font-700 pt-5">
        页面未找到
      </h1>
      <div className="mx-auto my-6 bg-divider h-px w-16"></div>
      <blockquote className="text-14px text-muted-foreground leading-[2] font-500 mx-auto max-w-64">
        但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。
      </blockquote>
      <div className="pt-5">
        <EbbLink
          aria-label="go to home"
          className="text-14px text-brand font-500 px-4 py-1 border border-brand rounded-4 inline-flex"
          href="/"
        >
          带我回首页
        </EbbLink>
      </div>
    </div>
  )
}
