import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Planetlocksmiths | Automotive Locksmiths in Philadelphia',
    template: '%s | Planetlocksmiths',
  },
  description:
    'Planetlocksmiths provides premium mobile automotive locksmith services across Philadelphia with urgent 24/7 response.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sora.variable} font-inter bg-bg text-text`}
      >
        {children}
      </body>
    </html>
  );
}
