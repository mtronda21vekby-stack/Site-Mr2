import './globals.css'
import type { Metadata } from 'next'
import CookieConsent from '@/components/layout/CookieConsent'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.com'
const siteName = 'Planet Locksmiths'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: 'Mobile locksmith service in Philadelphia. Emergency lockouts, car keys, rekeys, commercial locks, residential locks, access control, and safe opening requests available 24/7.',
  openGraph: {
    type: 'website',
    siteName,
    url: siteUrl,
    title: siteName,
    description: 'Mobile locksmith service in Philadelphia. Emergency lockouts, car keys, rekeys, commercial locks, residential locks, access control, and safe opening requests available 24/7.',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: 'Mobile locksmith service in Philadelphia. Emergency lockouts, car keys, rekeys, commercial locks, residential locks, access control, and safe opening requests available 24/7.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
