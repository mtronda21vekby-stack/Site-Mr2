import type { Locale } from '@/components/layout/Header';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  await params;
  return <>{children}</>;
}
