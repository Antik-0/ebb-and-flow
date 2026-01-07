import '@unocss/reset/tailwind-v4.css'
import '#/assets/main.css'
import '@ebb/theme/styles/main.css'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
