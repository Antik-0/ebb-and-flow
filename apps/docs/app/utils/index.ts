import { themeConfig } from '#/theme.config'

export function formatTitle(title?: string): string {
  const template = themeConfig.titleTemplate
  return title ? template.replaceAll('<title>', title) : themeConfig.title
}
