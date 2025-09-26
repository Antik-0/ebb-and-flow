import { useData } from 'vitepress'
import { computed } from 'vue'

export function useLayout() {
  const { page } = useData()

  const layout = computed(() => page.value.frontmatter.layout ?? 'doc')

  return {
    layout
  }
}
