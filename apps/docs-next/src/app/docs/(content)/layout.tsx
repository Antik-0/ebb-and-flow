import { EbbPage } from '#/theme'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <EbbPage>{children}</EbbPage>
}
