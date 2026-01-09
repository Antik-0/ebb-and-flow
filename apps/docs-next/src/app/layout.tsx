'use client'
import { EbbThemeProvider } from '@ebb/theme'
import { themeConfig } from '#/theme.config.ts'

import '@unocss/reset/tailwind-v4.css'
import '@ebb/theme/styles/main.css'
import '#/assets/main.css'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log(themeConfig)
  return (
    <html lang="zh-CN">
      <body>
        <EbbThemeProvider config={themeConfig}>{children}</EbbThemeProvider>
      </body>
    </html>
  )
}
