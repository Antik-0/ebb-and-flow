import Link from '#/components/Link.vue'

export default function NotFound() {
  return (
    <div class="w-full px-8 py-24 text-center">
      <p class="font-600 text-16 leading-[1]">404</p>
      <h1 class="pt-5 font-700 text-5 leading-[2] tracking-2px">页面未找到</h1>
      <div class="mx-auto my-6 h-px w-16 bg-divider"></div>
      <blockquote class="mx-auto max-w-64 font-500 text-14px text-muted-foreground leading-[2]">
        但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。
      </blockquote>
      <div class="pt-5">
        <Link
          aria-label="go to home"
          class="inline-flex rounded-4 border border-brand px-4 py-1 font-500 text-14px text-brand"
          href="/"
        >
          带我回首页
        </Link>
      </div>
    </div>
  )
}
