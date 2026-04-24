import './globals.css'
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Planetlocksmiths',
    template: '%s | Planetlocksmiths',
  },
  description: 'Mobile automotive locksmith service in Philadelphia. Car lockout help, key replacement, and key programming available 24/7.',
  openGraph: {
    type: 'website',
    siteName: 'Planetlocksmiths',
    url: siteUrl,
    title: 'Planetlocksmiths',
    description: 'Mobile automotive locksmith service in Philadelphia. Car lockout help, key replacement, and key programming available 24/7.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planetlocksmiths',
    description: 'Mobile automotive locksmith service in Philadelphia. Car lockout help, key replacement, and key programming available 24/7.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
