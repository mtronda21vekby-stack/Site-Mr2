import settings from '@/content/settings/global.json';

export const siteUrl = 'https://planetlocksmiths.pages.dev';

export function buildPageTitle(title?: string) {
  return title ? `${title} | ${settings.brandName}` : `${settings.brandName} | Automotive Locksmith in Philadelphia`;
}
