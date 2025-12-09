import type { MaybeRef } from 'vue'
import { toRef, watch } from 'vue'

interface PageTitleOptions {
  /**
   * 标题模板
   * @example 'prefix <title> | suffix'
   */
  titleTemplate?: string
  /**
   * 标题模板占位符
   * @default '<title>''
   */
  placeholder?: string
}

export function usePageTitle(
  title?: MaybeRef<string>,
  options?: PageTitleOptions
) {
  const placeholder = options?.placeholder ?? '<title>'
  const originalTitle = document?.title ?? ''

  const pageTitle = toRef(title ?? originalTitle)

  watch(
    () => pageTitle.value,
    (newTitle, oldTitle) => {
      if (newTitle !== oldTitle && document) {
        document.title = format(newTitle)
      }
    },
    { immediate: true }
  )

  function format(title: string) {
    const titleTemplate = options?.titleTemplate
    if (!titleTemplate) {
      return title
    }
    return titleTemplate.replaceAll(placeholder, title)
  }

  return pageTitle
}
