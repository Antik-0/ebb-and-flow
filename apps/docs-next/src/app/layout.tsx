import { EbbThemeProvider } from '#/theme'
import { themeConfig } from '#/theme.config.ts'

import '@unocss/reset/tailwind-v4.css'
import '#/theme/styles/main.css'
import '#/assets/main.css'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div id="app">
          <EbbThemeProvider config={themeConfig}>{children}</EbbThemeProvider>
        </div>
      </body>
    </html>
  )
}
