import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ViralShortsOps - Auto-Generate Viral Videos',
  description: 'Automatically generate and post short-form viral videos to social media',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
