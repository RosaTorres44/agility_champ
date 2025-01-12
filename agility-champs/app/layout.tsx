import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agility Champ',
  description: 'Created with v0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
