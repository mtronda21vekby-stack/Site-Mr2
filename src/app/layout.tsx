import type { Metadata } from 'next'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Planetlocksmiths',
    template: '%s',
  },
  description: 'Mobile automotive locksmith service across Philadelphia, PA.',
  applicationName: 'Planetlocksmiths',
  authors: [{ name: 'Planetlocksmiths' }],
  creator: 'Planetlocksmiths',
  publisher: 'Planetlocksmiths',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Planetlocksmiths',
    description: 'Mobile automotive locksmith service across Philadelphia, PA.',
    url: siteUrl,
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
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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
