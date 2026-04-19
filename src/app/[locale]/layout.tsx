import type { Locale } from '@/components/layout/Header';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  // We intentionally leave this layout minimal. Headers and footers are
  // included in the page component so that they can access locale-specific
  // settings. In the future you could add providers or context here if needed.
  return <>{children}</>;
}