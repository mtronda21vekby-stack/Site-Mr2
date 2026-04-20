import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  title: 'Planetlocksmiths',
  description: 'Mobile automotive locksmith service across Philadelphia, PA.',
  openGraph: {
    title: 'Planetlocksmiths',
    description: 'Mobile automotive locksmith service across Philadelphia, PA.',
    url: '/',
    siteName: 'Planetlocksmiths',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planetlocksmiths',
    description: 'Mobile automotive locksmith service across Philadelphia, PA.',
  },
  icons: {
    icon: '/favicon.ico',
  },
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
