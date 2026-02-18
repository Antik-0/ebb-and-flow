'use client'
import type { PropsWithChildren } from 'react'
import type { ThemeConfig } from './types'
import { createContext, createElement, useContext } from 'react'

function createEbbTheme() {
  const EbbThemeCtx = createContext<ThemeConfig>({} as ThemeConfig)

  const Provider = (props: PropsWithChildren<{ config: ThemeConfig }>) => {
    const { config, children } = props
    return createElement(EbbThemeCtx, { value: config }, children)
  }

  const useTheme = () => {
    const theme = useContext(EbbThemeCtx)
    return { theme }
  }

  return [Provider, useTheme] as const
}

export const [EbbThemeProvider, useTheme] = createEbbTheme()
