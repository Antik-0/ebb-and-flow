import { EbbThemeProvider } from '#/theme'
import { themeConfig } from '#/theme.config.ts'

import '@unocss/reset/tailwind-v4.css'
import '#/assets/main.css'
import 'ebb-ui/main.css'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className="dark" data-scroll-behavior="smooth" lang="zh-CN">
      <body>
        <div id="app">
          <EbbThemeProvider config={themeConfig}>{children}</EbbThemeProvider>
        </div>
      </body>
    </html>
  )
}
