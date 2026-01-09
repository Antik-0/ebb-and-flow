'use client'
import type { PropsWithChildren } from 'react'
import type { ThemeConfig } from '#/types'
import { ThemeContext } from '#/theme'

interface EbbThemeProps {
  config: ThemeConfig
  theme?: 'light' | 'dark'
}

export function EbbThemeProvider(props: PropsWithChildren<EbbThemeProps>) {
  const { config, theme, children } = props

  return <ThemeContext value={config} />
}
