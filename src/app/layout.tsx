import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planetlocksmiths | Automotive Locksmith in Philadelphia',
  description: 'Mobile automotive locksmith service in Philadelphia. Car lockout help, key replacement, and key programming available 24/7.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg font-inter text-text">
        {children}
      </body>
    </html>
  );
}
