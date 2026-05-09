import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bloome — Arrange. Send. Mean it.',
  description: 'Build your own digital bouquet. Send it to someone you love.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
