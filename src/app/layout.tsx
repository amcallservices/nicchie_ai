import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KDP Niche Hunter AI - Find Profitable Amazon KDP Niches',
  description: 'AI-powered Amazon KDP niche research tool. Find profitable niches, analyze competitors, and discover trending topics before anyone else.',
  keywords: ['KDP', 'Amazon Kindle', 'niche research', 'self-publishing', 'book writing', 'passive income'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 antialiased">
        {children}
      </body>
    </html>
  )
}