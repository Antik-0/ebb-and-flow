import { EbbLayoutPage } from '#/theme'

export default function PageLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <EbbLayoutPage>{children}</EbbLayoutPage>
}
